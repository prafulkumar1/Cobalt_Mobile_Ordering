import { navigateToScreen } from '@/components/constants/Navigations';
import { getFormFieldDataSelector, getProfitCenterData } from '@/components/redux/reducers/loginReducer';
import { postApiCall } from '@/components/utlis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Component } from 'react'
import { Dimensions } from 'react-native';
import * as DeviceInfo from 'expo-device';
const { width, height } = Dimensions.get('window');
const pageId='Login';

interface IState{}
interface IProps{
  navigation:{navigate:(params:string) => void}
  formData:Object,
  setFormFieldData:({formId, controlType, controlId, controlValue, isInvalid,errorMessage}) => void
  resentFormData:({formId, controlType, controlId, controlValue, isInvalid,errorMessage}) => void
  showPassword:() =>void
  getFormFieldData:() => void
  isPasswordVisible:boolean
  isModalVisible:boolean
  forgetPassModal:()=>void
  getProfitCenterData:() =>void
}
interface SS{}

export default class useLoginLogic extends Component<IProps,IState,SS> {
  dimensionListener: any;
    constructor(props:IProps){
      super(props)
      this.state ={}
    }
    componentDidMount() {
    }
   
    componentWillUnmount() {
    }
}

