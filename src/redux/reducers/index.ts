import { fetchDaoList, fetchProposals, login } from 'redux/actions';
import { AuthState, DaoState, ProposalState } from 'types/store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

const initialState = {
  items: [],
  error: null,
  loading: false,
};

export const auth = reducerWithInitialState<AuthState>({ accountId: null })
  .case(login.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(login.done, (state, { result }) => ({
    ...state,
    accountId: result,
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

export const proposals = reducerWithInitialState<ProposalState>(initialState)
  .case(fetchProposals.started, (state) => ({
    ...state,
    loading: true,
  }))
  .case(fetchProposals.done, (state, { result }) => ({
    ...state,
    items: result,
    loading: false,
  }))
  .build();
