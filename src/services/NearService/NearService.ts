/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  connect,
  Contract,
  keyStores,
  Near,
  WalletConnection,
} from 'near-api-js';
import { NearConfig, nearConfig } from 'config';
import Decimal from 'decimal.js';
import { CreateDaoParams, DaoItem } from 'types/dao';
import { AccountState } from 'near-api-js/lib/account';
import { timestampToReadable } from 'utils/getVotePeriod';
import {
  CreateProposalParams,
  Proposal,
  ProposalRaw,
  ProposalType,
} from 'types/proposal';
import camelcaseKeys from 'camelcase-keys';
import { ContractPool } from './ContractPool';

export const parseForumUrl = (url: string): string => {
  // let afterSlashChars = id.match(/\/([^\/]+)\/?$/)[1];
  const a = url.replace(/\/$/, '').split('/');
  const last = a[a.length - 1];
  const secondLast = a[a.length - 2];
  let category = null;
  let subCategory = null;

  if (/^\d+$/.test(secondLast)) {
    category = secondLast;
    subCategory = last;
  } else if (/^\d+$/.test(last)) {
    category = last;
  }

  if (category === null) {
    return '';
  }

  return subCategory === null
    ? `/t/${category}`
    : `/t/${category}/${subCategory}`;
};

export const URLTest = (url: string): boolean => {
  const regExp = /^(ftp|http|https):\/\/[^ "]+$/;

  return regExp.test(url);
};
export const yoktoNear = 1000000000000000000000000;

class NearService {
  private readonly config: NearConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private factoryContract!: Contract & any;

  private walletConnection!: WalletConnection;

  private near!: Near;

  private contractPool!: ContractPool;

  constructor(config: NearConfig) {
    this.config = config;
  }

  public async init(): Promise<void> {
    // eslint-disable-next-line no-console
    // console.log('NearService: init');
    this.near = await connect({
      deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      ...this.config,
    });

    this.walletConnection = new WalletConnection(this.near, 'sputnik');

    const account = this.walletConnection.account();

    this.factoryContract = new Contract(account, this.config.contractName, {
      viewMethods: ['get_dao_list'],
      changeMethods: ['create'],
    });

    this.contractPool = new ContractPool(account);
  }

  public login(): Promise<void> {
    return this.walletConnection.requestSignIn(
      this.config.contractName,
      'Sputnik DAO',
    );
  }

  public async logout(): Promise<void> {
    this.walletConnection.signOut();
  }

  public isAuthorized(): boolean {
    return this.walletConnection.isSignedIn();
  }

  public async getAccount() {
    return this.walletConnection.getAccountId();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createDao(params: CreateDaoParams): Promise<any> {
    const argsList = {
      purpose: params.purpose,
      council: params.council.split('\n').filter((item) => item),
      bond: new Decimal(params.bond).mul(yoktoNear).toFixed(),
      vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
      grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
    };

    const amount = new Decimal(params.amountToTransfer);
    const amountYokto = amount.mul(yoktoNear).toFixed();
    const args = Buffer.from(JSON.stringify(argsList)).toString('base64');

    return this.factoryContract.create(
      {
        name: params.name,
        args,
      },
      new Decimal('45000000000000').toString(), // todo move to constant
      amountYokto.toString(),
    );
  }

  public async createProposal(params: CreateProposalParams): Promise<any> {
    const data: any = {
      target: params.target,
      description: `${params.description} ${parseForumUrl(params.link)}`.trim(),
      kind: {
        type: params.kind.type,
      },
    };

    if (params.kind.type === ProposalType.Payout) {
      const amount = new Decimal(params.kind.amount);
      const amountYokto = amount.mul(yoktoNear).toFixed();

      data.kind.amount = amountYokto;
    }

    if (params.kind.type === ProposalType.ChangeVotePeriod) {
      const votePeriod = new Decimal(params.kind.votePeriod).mul('3.6e12');

      data.kind.vote_period = votePeriod;
    }

    if (params.kind.type === ProposalType.ChangePurpose) {
      data.kind.purpose = params.kind.purpose;
    }

    return this.contractPool.get(params.daoId).add_proposal(
      {
        proposal: data,
      },
      new Decimal('30000000000000').toString(),
      params.bond,
    );
  }

  public async getDaoList(): Promise<DaoItem[]> {
    const list: string[] = await this.factoryContract.get_dao_list();
    const details = await Promise.all(
      list.map((daoId: string) =>
        Promise.all([
          this.getDaoAmount(daoId),
          this.getBond(daoId),
          this.getPurpose(daoId),
          this.getVotePeriod(daoId),
          this.getNumProposals(daoId),
          this.getCouncil(daoId),
        ]),
      ),
    );

    return list.map(
      (daoId, index): DaoItem => ({
        id: daoId,
        amount: details[index][0],
        bond: details[index][1],
        purpose: details[index][2],
        votePeriod: details[index][3],
        numberOfProposals: details[index][4],
        numberOfMembers: details[index][5].length,
        members: details[index][5],
      }),
    );
  }

  public async getDaoState(contractId: string): Promise<AccountState> {
    try {
      const account = await this.near.account(contractId);

      return account.state();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return {
        amount: '0',
        code_hash: '',
        storage_usage: 0,
        locked: '0',
      };
    }
  }

  public async getDaoAmount(contractId: string): Promise<string> {
    try {
      const state = await this.getDaoState(contractId);
      const amountYokto = new Decimal(state.amount);

      return amountYokto.div(yoktoNear).toFixed(2);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return '0';
    }
  }

  public async getBond(contractId: string): Promise<string> {
    try {
      const bond = await this.contractPool.get(contractId).get_bond();

      return new Decimal(bond.toString()).div(yoktoNear).toString();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return '0';
    }
  }

  public async getVotePeriod(contractId: string): Promise<string> {
    try {
      const votePeriod = await this.contractPool
        .get(contractId)
        .get_vote_period();

      return timestampToReadable(votePeriod);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return '0';
    }
  }

  public async getNumProposals(contractId: string): Promise<number> {
    try {
      return await this.contractPool.get(contractId).get_num_proposals();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return 0;
    }
  }

  public async getPurpose(contractId: string): Promise<string> {
    try {
      return await this.contractPool.get(contractId).get_purpose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return '';
    }
  }

  public async getProposals(
    contractId: string,
    limit: number,
    index = 0,
  ): Promise<Proposal[]> {
    try {
      const proposals = await this.contractPool
        .get(contractId)
        .get_proposals({ from_index: index, limit });

      return camelcaseKeys(proposals, { deep: true }).map(
        (item: ProposalRaw, itemIndex: number) => {
          if (item.kind.type === ProposalType.Payout) {
            const amountYokto = new Decimal(item.kind.amount);

            amountYokto.div(yoktoNear).toFixed(2);

            return {
              ...item,
              kind: {
                type: ProposalType.Payout,
                amount: amountYokto.div(yoktoNear).toFixed(2),
              },
              daoId: contractId,
              id: itemIndex,
            };
          }

          return {
            ...item,
            daoId: contractId,
            id: itemIndex,
          };
        },
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return [];
    }
  }

  public async getAllProposals(contractId: string): Promise<Proposal[]> {
    try {
      const limit = await this.getNumProposals(contractId);

      return await this.getProposals(contractId, limit);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return [];
    }
  }

  public async getCouncil(contractId: string): Promise<string[]> {
    try {
      return await this.contractPool.get(contractId).get_council();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return [];
    }
  }

  public addProposal(contractId: string): Promise<void> {
    return this.contractPool.get(contractId).add_proposal;
  }

  public vote(
    contractId: string,
    proposalId: number,
    vote: 'Yes' | 'No',
  ): Promise<void> {
    return this.contractPool.get(contractId).vote({
      id: proposalId,
      vote,
    });
  }

  public finalize(contractId: string, proposalId: number): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId,
    });
  }
}

const nearService = new NearService(nearConfig);

export default nearService;
