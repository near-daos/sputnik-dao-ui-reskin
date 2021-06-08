import {
  fetchDaoList,
  login,
  logout,
  fetchAccount,
  clearRedirect,
  setCreatingDaoData,
  clearCreatingDaoData,
} from 'redux/actions';
import { AuthState, CreatDaoState, DaoState, RedirectState } from 'types/store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

const initialState = {
  items: [],
  error: null,
  loading: false,
};

export const auth = reducerWithInitialState<AuthState>({ accountId: null })
  .case(fetchAccount.done, (state, { result }) => ({
    ...state,
    accountId: result,
  }))
  .case(login.done, (state, { result }) => ({
    ...state,
    accountId: result,
  }))
  .case(logout.done, (state) => ({
    ...state,
    accountId: null,
  }))
  .build();

export const daos = reducerWithInitialState<DaoState>(initialState)
  .case(fetchDaoList.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(fetchDaoList.done, (state, { result }) => ({
    ...state,
    items: result,
    loading: false,
  }))
  .build();

export const redirect = reducerWithInitialState<RedirectState>({
  flow: null,
})
  .case(login.started, (state, payload) => ({
    flow: payload || state.flow,
  }))
  .case(clearRedirect, () => ({
    flow: null,
  }))
  .build();

export const createDao = reducerWithInitialState<CreatDaoState>({
  creatingDao: {
    name: '',
    purpose: '',
    council: '',
    bond: '0.1',
    votePeriod: '168',
    gracePeriod: '24',
    amountToTransfer: '5',
  },
})
  .case(setCreatingDaoData, (state, payload) => ({
    creatingDao: payload,
  }))
  .case(clearCreatingDaoData, () => ({
    creatingDao: {
      name: '',
      purpose: '',
      council: '',
      bond: '0.1',
      votePeriod: '168',
      gracePeriod: '24',
      amountToTransfer: '5',
    },
  }))
  .build();
