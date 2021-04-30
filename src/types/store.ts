import { Proposal } from './proposal';
import { CreateDaoParams, DaoItem } from './dao';
import { RedirectFlow } from './index';

export type DaoState = {
  error: null | Error;
  loading: boolean;
  items: DaoItem[];
};

export type ProposalState = {
  error: null | Error;
  loading: boolean;
  items: Proposal[];
};

export type AuthState = {
  accountId: string | null;
};

export type RedirectState = {
  flow: RedirectFlow | null;
};

export type CreatDaoState = {
  creatingDao: CreateDaoParams;
};

export interface StoreState {
  auth: AuthState;
  daos: DaoState;
  proposals: ProposalState;
  redirect: RedirectState;
  createDao: CreatDaoState;
}
