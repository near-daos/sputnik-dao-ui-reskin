import { CreateDaoParams, DaoItem } from 'types/dao';
import { CreateProposalParams, Proposal } from 'types/proposal';
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('sputnik-dao');

export const login = actionCreator.async<void, string, Error>('LOGIN');

export const logout = actionCreator.async<void, void, Error>('LOGOUT');

export const fetchAccount = actionCreator.async<void, string, Error>(
  'FETCH_ACCOUNT',
);

export const fetchDaoList = actionCreator.async<void, DaoItem[], Error>(
  'FETCH_DAO_LIST',
);

export const fetchProposals = actionCreator.async<string, Proposal[], Error>(
  'FETCH_PROPOSALS',
);

export const createDao = actionCreator.async<CreateDaoParams, void, Error>(
  'CREATE_DAO',
);

export const createProposal = actionCreator.async<
  CreateProposalParams,
  void,
  Error
>('CREATE_PROPOSAL');
