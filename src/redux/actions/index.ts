import { CreateDaoParams, DaoItem } from 'types/dao';
import { CreateProposalParams, Proposal } from 'types/proposal';
import actionCreatorFactory from 'typescript-fsa';
import { RedirectFlow } from 'types';

const actionCreator = actionCreatorFactory('sputnik-dao');

export const login = actionCreator.async<RedirectFlow | void, string, Error>(
  'LOGIN',
);

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

export const clearRedirect = actionCreator<void>('CLEAR_REDIRECT');

export const setCreatingDaoData = actionCreator<CreateDaoParams>(
  'SET_CREATING_DAO_DATA',
);
export const clearCreatingDaoData = actionCreator<void>(
  'CLEAR_CREATING_DAO_DATA',
);
