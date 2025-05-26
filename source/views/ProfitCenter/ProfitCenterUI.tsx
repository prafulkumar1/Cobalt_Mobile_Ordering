import * as UI from '@/components/cobalt/importUI';
import { connect } from 'react-redux';
import { RootState } from '@/components/redux/store';
import { styles } from '@/source/styles/login/loginStyle';
import useProfitCenterLogic from '@/source/controller/ProfitCenter/ProfitCenter';
const pageId = 'Login';
class ProfitCenterUI extends useProfitCenterLogic {
  render() {
    return (
      <UI.Text>
        hello world
      </UI.Text>
    );
  }
}

const mapStateToProps = (state:RootState) => {
  return {}
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ProfitCenterUI)

