import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userDataReducer from '../slices/login.slice';
import viajesReducer from '../slices/viajes.slice';

export const store = configureStore({
  reducer: {
      userData: userDataReducer,
      viajes: viajesReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
