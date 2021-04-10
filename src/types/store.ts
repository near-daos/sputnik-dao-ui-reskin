import { Proposal } from './proposal';
import { DaoItem } from './dao';

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

export interface StoreState {
  auth: AuthState;
  daos: DaoState;
  proposals: ProposalState;
}
