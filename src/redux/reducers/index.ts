import { isNull } from 'lodash';
import {
  fetchDao,
  fetchDaoList,
  login,
  logout,
  fetchAccount,
  clearRedirect,
  setCreatingDaoData,
  clearCreatingDaoData,
} from 'redux/actions';
import { isNotNull } from 'types/guards';
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
  .case(fetchDao.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(fetchDaoList.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(fetchDao.done, (state, { result }) => {
    if (isNull(result)) return state;

    return {
      ...state,
      items: state.items.length
        ? state.items.map((item) => (item.id === result?.id ? result : item))
        : [result],
      loading: false,
    };
  })
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
