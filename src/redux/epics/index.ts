import { AnyAction } from 'typescript-fsa';
import { combineEpics, Epic } from 'redux-observable';

import { StoreState } from 'types/store';
import { ofAsyncAction } from 'redux/utils/operators';
import { fetchDaoList, fetchProposals, login, logout } from 'redux/actions';
import { NearService } from 'services/NearService';

const loginEpic = ofAsyncAction(login, async () => {
  await NearService.login();

  return NearService.getAccount();
});

const logoutEpic = ofAsyncAction(logout, () => NearService.logout());

const fetchDaoListEpic = ofAsyncAction(fetchDaoList, () =>
  NearService.getDaoList(),
);

const fetchProposalsEpic = ofAsyncAction(fetchProposals, (contractId: string) =>
  NearService.getAllProposals(contractId),
);

export const sputnikEpic: Epic<AnyAction, AnyAction, StoreState> = combineEpics(
  logoutEpic,
  loginEpic,
  fetchDaoListEpic,
  fetchProposalsEpic,
);
