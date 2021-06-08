import { createSelector } from 'reselect';
import { AuthState, DaoState, StoreState } from 'types/store';
import { RedirectFlow } from '../../types';
import { CreateDaoParams } from '../../types/dao';

export const authSelector = (state: StoreState): AuthState => state.auth;

export const daosSelector = (state: StoreState): DaoState => state.daos;

export const daoListSelector = createSelector(
  daosSelector,
  (state) => state.items,
);

export const daoSelector = createSelector(
  daoListSelector,
  (_: unknown, daoId: string) => daoId,
  (items, doaId) => items.find((item) => item.id === doaId),
);

export const accountSelector = createSelector(
  authSelector,
  (state) => state.accountId,
);

export const redirectSelector = (state: StoreState): RedirectFlow | null =>
  state.redirect.flow;

export const creatingDaoSelector = (state: StoreState): CreateDaoParams =>
  state.createDao.creatingDao;
