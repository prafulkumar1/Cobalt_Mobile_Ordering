import * as UI from '@/components/cobalt/importUI';
import { connect } from 'react-redux';
import { RootState } from '@/components/redux/store';
import { styles } from '@/source/styles/ProfitCenterStyle';
import useProfitCenterLogic from '@/source/controller/ProfitCenter/ProfitCenter';
import { setAppConfigJsonData } from '@/components/redux/reducers/ProfitCenterReducer';
import CbLoader from '@/components/cobalt/cobaltLoader';
const pageId = 'Login';
class ProfitCenterUI extends useProfitCenterLogic {

  RenderingProfitCenter = ({item}) => {
    const isAvailable = item.STATUS === "Available";
    return (
        <UI.ConnectedCbImageBackground id="ProfitCenterBGImage"  source={{ uri: item?.ImageUrl ? item?.ImageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3CETL_OertJKScoHfblxs6CBrKGVCmVESw&s" }} style={styles.BGImage}>
            <UI.ConnectedCbBox id='BoxContainer' pageId={pageId} style={styles.blackShadow} />
            <UI.TouchableOpacity style={styles.profitCenter_btn} activeOpacity={0.6} onPress={() => this.navigateToMenuOrder(item)}>
                <UI.ConnectedCbBox id='BoxTextContainer' pageId={pageId} style={styles.profitCenterOverlay}>
                    <UI.ConnectedCbText id='ProfitCenterName' pageId={pageId} numberOfLines={1} style={[ styles.profitCenterName]}>{item.LocationName}</UI.ConnectedCbText>
                    <UI.ConnectedCbText id="TimingsText" pageId={pageId}  style={[ styles.profitCenterTimings]}>
                        {item.StatusText}
                    </UI.ConnectedCbText>
                </UI.ConnectedCbBox>
                <UI.ConnectedCbBox id="AvailabilityStatus" pageId={pageId} style={styles.statusBox} Conditionalstyle={isAvailable ? styles.available : styles.closed}>
                    <UI.ConnectedCbText id="AvailabilityStatusText" pageId={pageId} style={styles.statusText}>{item.STATUS}</UI.ConnectedCbText>
                </UI.ConnectedCbBox>
            </UI.TouchableOpacity>
        </UI.ConnectedCbImageBackground>
    );
};

  renderProfitCenters = () => {
    if (this.state.loading) {
        return (
            <UI.Box style={styles.loaderContainer}>
                <CbLoader />
            </UI.Box>
        )
    } else if (this.state.profitCenterData?.MealPeriodData.length === 0) {
        return (
            <UI.Box style={styles.emptyMealContainer}>
                <UI.Text style={styles.emptyMealTxt}>No profit centers available</UI.Text>
            </UI.Box>
        )
    } else {
          return (
            <UI.FlatList
            bounces={false}
            data={this.state.profitCenterData?.MealPeriodData}
            renderItem={(item) => this.RenderingProfitCenter(item)}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={15}
        />
        )
    }
}
  render() {
    return (
      <>
        {this.state.configloading ? (
          <CbLoader />
        ) : (
          <>
            <UI.Box style={styles.scrollContent}>
              <UI.ConnectedCbHeader
                navigation={this.props?.navigation}
                route={this.props.route}
                headerTitle={"Profit Centers"}
              />
            </UI.Box>
            {this.renderProfitCenters()}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state:RootState) => {
  return {}
}
const mapDispatchToProps = {
  setAppConfigJsonData
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfitCenterUI)

