import { DaoItem } from 'types/dao';
import { Proposal } from 'types/proposal';
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('sputnik-dao');

export const login = actionCreator.async<void, string, Error>('LOGIN');

export const logout = actionCreator.async<void, void, Error>('LOGOUT');

export const fetchDaoList = actionCreator.async<void, DaoItem[], Error>(
  'FETCH_DAO_LIST',
);

export const fetchProposals = actionCreator.async<string, Proposal[], Error>(
  'FETCH_PROPOSALS',
);
