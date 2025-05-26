import { postApiCall } from '@/components/utlis/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginDetails : [],
    loading:false,
    logintxt:"",
    password:"",
    formData:{},
    isPasswordVisible:false,
    isTooltipVisible:false,
    isModalVisible:false,
    profitCenterResp : null,
    errorMessage:""
}

export const getProfitCenterData = createAsyncThunk(
  'getProfitCenterData',
  async (
    _,
    { getState, rejectWithValue, fulfillWithValue },
  ) => {
    const params = {
      FilterDate: "",
      FilterTime: "",
    };
    const profitCenterResponseData = await postApiCall("PROFIT_CENTER","GET_PROFIT_CENTERS",params)
    if (profitCenterResponseData) {
      if(profitCenterResponseData.statusCode === 200){
        if (profitCenterResponseData.response) {
          return fulfillWithValue(profitCenterResponseData.response);
        } else {
          return rejectWithValue(profitCenterResponseData.response);
        }
      }else{
        return rejectWithValue(profitCenterResponseData.response);
      }
    }
  },
);

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    handlePassword(state, action) {
        state.password = action.payload
    },
    setFormFieldData(state, action) {
      const { formId, controlType, controlId, controlValue, isInvalid, errorMessage } = action.payload;
      state.formData = {
        ...state.formData,
        [formId + '_' + controlId]: {
          value: controlValue,
          isInvalid: isInvalid ?? false,
          errorMessage: errorMessage ?? '',
        },
      };
    },
    getFormFieldData(state, action) {
      // const loadScreen = store.getState().dashboard.loading
      // console.log(loadScreen,"--->screen")
    },
    showPassword(state, action) {
      state.isPasswordVisible = !state.isPasswordVisible
    },
    showToolTip(state, action) {
      state.isTooltipVisible = !state.isTooltipVisible
    },
    forgetPassModal(state, action) {
      state.isModalVisible = !state.isModalVisible
    },
    resentFormData(state,action){
      const { formId, controlType, controlId, controlValue, isInvalid, errorMessage } = action.payload;
      state.formData = {
        [formId + '_' + controlId]: {
          value: "",
          isInvalid: isInvalid ?? false,
          errorMessage: errorMessage ?? '',
        },
      };
    }
  },
  extraReducers: builder => {
    builder
    .addCase(getProfitCenterData.pending, (state, action) => {
      state.loading = true;
     })
    .addCase(getProfitCenterData.fulfilled, (state, action) => {
      state.loading = false;
      state.profitCenterResp = action.payload
    })
    .addCase(getProfitCenterData.rejected, (state, action:any) => {
      state.loading = false;
      state.errorMessage = action?.payload?.ResponseMessage
    });
  },
})

export const { handlePassword,setFormFieldData,getFormFieldData,showPassword ,showToolTip ,forgetPassModal,resentFormData}:any = loginSlice.actions
export default loginSlice.reducer

export const getFormFieldDataSelector = (state: any, formId: string, controlId: string) => {
  return state?.[formId + '_' + controlId] || { value: '', isInvalid: false, errorMessage: '' };
};