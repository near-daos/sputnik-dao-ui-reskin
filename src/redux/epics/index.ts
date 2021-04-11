import { AnyAction } from 'typescript-fsa';
import { combineEpics, Epic } from 'redux-observable';

import { StoreState } from 'types/store';
import { ofAsyncAction } from 'redux/utils/operators';
import {
  createDao,
  createProposal,
  fetchAccount,
  fetchDaoList,
  fetchProposals,
  login,
  logout,
} from 'redux/actions';
import { NearService } from 'services/NearService';

const loginEpic = ofAsyncAction(login, async () => {
  await NearService.login();

  return NearService.getAccount();
});

const logoutEpic = ofAsyncAction(logout, () => NearService.logout());

const fetchAccountEpic = ofAsyncAction(fetchAccount, () =>
  NearService.getAccount(),
);

const fetchDaoListEpic = ofAsyncAction(fetchDaoList, () =>
  NearService.getDaoList(),
);

const fetchProposalsEpic = ofAsyncAction(fetchProposals, (contractId: string) =>
  NearService.getAllProposals(contractId),
);

const createDaoEpic = ofAsyncAction(createDao, (params) =>
  NearService.createDao(params),
);

const createProposalEpic = ofAsyncAction(createProposal, (params) =>
  NearService.createProposal(params),
);

export const sputnikEpic: Epic<AnyAction, AnyAction, StoreState> = combineEpics(
  loginEpic,
  logoutEpic,
  createDaoEpic,
  createProposalEpic,
  fetchAccountEpic,
  fetchDaoListEpic,
  fetchProposalsEpic,
);
