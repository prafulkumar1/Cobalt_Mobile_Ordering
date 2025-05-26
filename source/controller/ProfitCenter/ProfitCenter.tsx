import { Component } from 'react'
import { Dimensions } from 'react-native';
import * as DeviceInfo from 'expo-device';
const { width, height } = Dimensions.get('window');
const pageId='Login';

interface IState{}
interface IProps{
  navigation:{navigate:(params:string) => void}
}
interface SS{}

export default class useProfitCenterLogic extends Component<IProps,IState,SS> {
    constructor(props:IProps){
      super(props)
      this.state ={}
    }
    componentDidMount() {
    }
   
    componentWillUnmount() {
    }
}

