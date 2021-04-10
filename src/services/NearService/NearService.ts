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
import { Proposal, ProposalRaw } from 'types/proposal';
import camelcaseKeys from 'camelcase-keys';
import { ContractPool } from './ContractPool';

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
    this.near = await connect({
      deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      ...this.config,
    });

    this.walletConnection = new WalletConnection(this.near, null);

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

  public getAccount() {
    return this.walletConnection.getAccountId();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createDao(params: CreateDaoParams): Promise<any> {
    const argsList = {
      purpose: params.purpose,
      council: params.council.split('\n'),
      bond: new Decimal(params.bond).mul(yoktoNear).toFixed(),
      vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
      grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
    };

    const amount = new Decimal(params.amount);
    const amountYokto = amount.mul(yoktoNear).toFixed();
    const args = Buffer.from(JSON.stringify(argsList)).toString('base64');

    return this.factoryContract.create(
      {
        name: params.name,
        args,
      },
      new Decimal('45000000000000').toString(),
      amountYokto.toString(),
    );
  }

  public async getDaoList(): Promise<DaoItem[]> {
    const list: string[] = await this.factoryContract.get_dao_list();
    const filteredList = list.filter(
      (daoId: string) => daoId !== 'daotest9.dev-1610115292586-3217148',
    );

    const details = await Promise.all(
      filteredList.map((daoId: string) =>
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

    return filteredList.map(
      (daoId, index): DaoItem => ({
        id: daoId,
        amount: details[index][0],
        bond: details[index][1],
        purpose: details[index][2],
        votePeriod: details[index][3],
        numberOfProposals: details[index][4],
        numberOfMembers: details[index][5].length,
      }),
    );
  }

  public async getDaoState(contractId: string): Promise<AccountState> {
    const account = await this.near.account(contractId);

    return account.state();
  }

  public async getDaoAmount(contractId: string): Promise<string> {
    const state = await this.getDaoState(contractId);
    const amountYokto = new Decimal(state.amount);

    return amountYokto.div(yoktoNear).toFixed(2);
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

  public getNumProposals(contractId: string): Promise<number> {
    return this.contractPool.get(contractId).get_num_proposals();
  }

  public getPurpose(contractId: string): Promise<string> {
    return this.contractPool.get(contractId).get_purpose();
  }

  public async getProposals(
    contractId: string,
    limit: number,
    index = 0,
  ): Promise<Proposal[]> {
    const proposals = await this.contractPool
      .get(contractId)
      .get_proposals({ from_index: index, limit });

    return camelcaseKeys(proposals, { deep: true }).map(
      (item: ProposalRaw, itemIndex: number) => ({
        ...item,
        daoId: contractId,
        id: itemIndex,
      }),
    );
  }

  public async getAllProposals(contractId: string) {
    const limit = await this.getNumProposals(contractId);

    return this.getProposals(contractId, limit);
  }

  public getCouncil(contractId: string): Promise<string[]> {
    return this.contractPool.get(contractId).get_council();
  }

  public addProposal(contractId: string): Promise<void> {
    return this.contractPool.get(contractId).add_proposal;
  }

  public vote(
    contractId: string,
    proposalId: string,
    vote: string,
  ): Promise<void> {
    return this.contractPool.get(contractId).vote({
      id: proposalId,
      vote,
    });
  }

  public finalize(contractId: string, proposalId: string): Promise<void> {
    return this.contractPool.get(contractId).finalize({
      id: proposalId,
    });
  }
}

const nearService = new NearService(nearConfig);

export default nearService;