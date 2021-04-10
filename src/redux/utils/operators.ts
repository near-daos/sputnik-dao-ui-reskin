/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ActionCreator,
  AnyAction,
  Action,
  AsyncActionCreators,
} from 'typescript-fsa';
import { Observable, OperatorFunction } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { noParams } from '.';

export const ofAction = <T>(
  actionCreator: ActionCreator<T>,
): OperatorFunction<AnyAction, Action<T>> => (action$: Observable<AnyAction>) =>
  action$.pipe(filter(actionCreator.match));

export const ofActionPayload = <T>(
  actionCreator: ActionCreator<T>,
): OperatorFunction<AnyAction, T> => (action$: Observable<AnyAction>) =>
  action$.pipe(
    ofAction(actionCreator),
    map((action) => action.payload),
  );

export const ofAsyncAction = <TParameters, TSuccess, TError>(
  asyncAction: AsyncActionCreators<TParameters, TSuccess, TError>,
  apiCall: (params: TParameters) => Promise<TSuccess>,
) => (action$: Observable<AnyAction>) =>
  action$.pipe(
    ofActionPayload(asyncAction.started),
    switchMap(apiCall),
    map((result) => asyncAction.done({ params: noParams, result })),
  );
