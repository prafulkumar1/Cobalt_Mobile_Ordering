import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import login from  "./reducers/loginReducer"
import dashboard from  "./reducers/dashboardReducer"
export const store = configureStore({
  reducer: {
    login,
    dashboard
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;