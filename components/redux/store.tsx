import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import login from  "./reducers/loginReducer"
import ProfitCenter from  "./reducers/ProfitCenterReducer"
import MenuOrder from  "./reducers/MenuOrderReducer"
import Cart from  "./reducers/CartReducer"

export const store = configureStore({
  reducer: {
    login,
    ProfitCenter,
    MenuOrder,
    Cart
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;