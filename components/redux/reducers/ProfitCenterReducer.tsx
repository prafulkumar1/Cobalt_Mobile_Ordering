import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  addMemberIndex: null as number | null, 
  loading:false,
  AppConfigJson:null,
  dropDownIndex: null as number | null,
  OpenAddmemberModel: false ,
  closeMemberModel:false,
  ThankYouModel:false
};

export const getAppConfiguration = createAsyncThunk(
  'getAppConfiguration',
  async (
    _,
    { getState, rejectWithValue, fulfillWithValue },
  ) => {
    const params = {};
    let AppConfigJsonData = await postApiCall("UI_CONFIGURATIONS", "GET_UI_CONFIGURATIONS", {});
    if (AppConfigJsonData) {
      if(AppConfigJsonData.statusCode === 200){
        if (AppConfigJsonData.response) {
          return fulfillWithValue(AppConfigJsonData.response?.Data);
        } else {
          return rejectWithValue(AppConfigJsonData.response?.Data);
        }
      }else{
        return rejectWithValue(AppConfigJsonData.response?.Data);
      }
    }
  },
);
export const loadPageConfigurations = (payload: {pageID:string,controlId:string}) => (_: any, getState:any) => {
  const {pageID,controlId} = payload
  const state = getState();
  const pageConfig = state.reservation.AppConfigJson?.find(
    (item:{PageId:string}) => item.PageId === pageID
  );
  if (!pageConfig) return null;

  const pageConfigJson = pageConfig.Controls.map((control:any) => {
    try {
      return JSON.parse(control.ControlJson);
    } catch (error) {
      console.error("Error parsing ControlJson:", error);
      return null;
    }
  });

  const controlConfig = pageConfigJson.find((item:{id:string}) => item?.id === controlId);
  return controlConfig;
};

const ProfitCenterSlice = createSlice({
  name: "ProfitCenter",
  initialState: initialState,
  reducers: {
    setAppConfigJsonData(state, action) {
      state.AppConfigJson = action.payload
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppConfiguration.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAppConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.AppConfigJson = action.payload;
      })
      .addCase(getAppConfiguration.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {setAppConfigJsonData}:any = ProfitCenterSlice.actions;

export default ProfitCenterSlice.reducer;