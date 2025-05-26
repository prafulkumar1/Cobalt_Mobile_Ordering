import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading:false,
    dashboardResponse:null,
    errorMessage:""
}

export const getDashBoardData = createAsyncThunk(
  'getDashBoardData',
  async (
    _,
    { getState, rejectWithValue, fulfillWithValue },
  ) => {
    const params = {};
    const dashboardResponse = await postApiCall("DASHBOARD","GET_DASHBOARD",params)
    if (dashboardResponse) {
      if(dashboardResponse.statusCode === 200){
        if (dashboardResponse.response) {
          return fulfillWithValue(dashboardResponse.response);
        } else {
          return rejectWithValue(dashboardResponse.response);
        }
      }else{
        return rejectWithValue(dashboardResponse.response);
      }
    }
  },
);
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    loadScreen(state, action) {
      state.loading = !state.loading
    },
  },
    extraReducers: builder => {
      builder
      .addCase(getDashBoardData.pending, (state, action) => {
        state.loading = true;
       })
      .addCase(getDashBoardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardResponse = action.payload
      })
      .addCase(getDashBoardData.rejected, (state, action:any) => {
        state.loading = false;
        state.errorMessage = action?.payload?.ResponseMessage
      });
    },
})

export const { loadScreen, } = dashboardSlice.actions
export default dashboardSlice.reducer