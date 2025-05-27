import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartData:null,
    modifierCartItemData:null
}



const cartSlice = createSlice({
  name: 'cartSlice',
  initialState: initialState,
  reducers: {
    handleAddCart(state, action) {
        state.cartData = action.payload
    },
    handleModifierCartItem(state, action) {
        state.modifierCartItemData = action.payload
    },
  },
//   extraReducers: builder => {
//     builder
//     .addCase(getProfitCenterData.pending, (state, action) => {
//       state.loading = true;
//      })
//     .addCase(getProfitCenterData.fulfilled, (state, action) => {
//       state.loading = false;
//       state.profitCenterResp = action.payload
//     })
//     .addCase(getProfitCenterData.rejected, (state, action:any) => {
//       state.loading = false;
//       state.errorMessage = action?.payload?.ResponseMessage
//     });
//   },
})

export const { handleAddCart,handleModifierCartItem}:any = cartSlice.actions
export default cartSlice.reducer