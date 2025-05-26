import * as UI from '@/components/cobalt/importUI';
import useLoginLogic from '@/source/controller/login/login';
import { connect } from 'react-redux';
import { forgetPassModal, getFormFieldData, getFormFieldDataSelector, getProfitCenterData, resentFormData, setFormFieldData, showPassword } from '@/components/redux/reducers/loginReducer';
import {Image, Modal} from "react-native"
import { RootState } from '@/components/redux/store';
import { styles } from '@/source/styles/login/loginStyle';
const pageId = 'Login';
class loginUI extends useLoginLogic {
  render() {
    const { setFormFieldData, getFormFieldData } = this.props
    return (
      <></>
    );
  }
}

const mapStateToProps = (state:RootState) => {
  return {}
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(loginUI)

