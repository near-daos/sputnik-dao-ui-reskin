import { createSelector } from 'reselect';
import { AuthState, DaoState, ProposalState, StoreState } from 'types/store';
import { RedirectFlow } from '../../types';

export const authSelector = (state: StoreState): AuthState => state.auth;

export const daosSelector = (state: StoreState): DaoState => state.daos;

export const proposalsSelector = (state: StoreState): ProposalState =>
  state.proposals;

export const daoListSelector = createSelector(
  daosSelector,
  (state) => state.items,
);

export const daoSelector = createSelector(
  daoListSelector,
  (_: unknown, daoId: string) => daoId,
  (items, doaId) => items.find((item) => item.id === doaId),
);

export const proposalListSelector = createSelector(
  proposalsSelector,
  (_: unknown, daoId: string) => daoId,
  (state, daoId) => state.items.filter((item) => item.daoId === daoId),
);

export const proposalSelector = createSelector(
  proposalListSelector,
  (_: unknown, _1: unknown, proposalId: number) => proposalId,
  (proposals, proposalId) => proposals.find((item) => item.id === proposalId),
);

export const accountSelector = createSelector(
  authSelector,
  (state) => state.accountId,
);

export const redirectSelector = (state: StoreState): RedirectFlow | null =>
  state.redirect.flow;
