import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginDetails : [],
    searchQuery:"",
    menuOrderData:null,
    isExitProfitCenter:false,
    itemDataVisible:false
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
    },
    closePreviewModal(state, action) {
      state.itemDataVisible = !state.itemDataVisible
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

export const { handleOnSearch,storeMenuOrderData,openCartRemovePopup,closePreviewModal}:any = menuOrderSlice.actions
export default menuOrderSlice.reducer