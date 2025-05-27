import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginDetails : [],
    searchQuery:"",
    menuOrderData:null,
    isExitProfitCenter:false
}



const menuOrderSlice = createSlice({
  name: 'menuOrderSlice',
  initialState: initialState,
  reducers: {
    handleOnSearch(state, action) {
        state.searchQuery = action.payload
    },
    storeMenuOrderData(state, action) {
        state.menuOrderData = action.payload
    },
    openCartRemovePopup(state, action) {
      state.isExitProfitCenter = !state.isExitProfitCenter
    }
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

export const { handleOnSearch,storeMenuOrderData,openCartRemovePopup}:any = menuOrderSlice.actions
export default menuOrderSlice.reducer