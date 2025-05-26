import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import login from  "./reducers/loginReducer"
import ProfitCenter from  "./reducers/ProfitCenterReducer"
export const store = configureStore({
  reducer: {
    login,
    ProfitCenter
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;