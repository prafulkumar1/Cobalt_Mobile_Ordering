import * as UI from '@/components/cobalt/importUI';
import useLoginLogic from '@/source/controller/login/login';
import { connect } from 'react-redux';
import { RootState } from '@/components/redux/store';
import useMenuOrderLogic from '@/source/controller/MenuOrder/MenuOrder';
import { Image } from '@/components/ui/image';
import { navigateToScreen } from '@/components/constants/Navigations';
import { styles } from '@/source/styles/MenuOrderStyle';
import { closePreviewModal, handleOnSearch, openCartRemovePopup, storeMenuOrderData } from '@/components/redux/reducers/MenuOrderReducer';
import CbLoaderForMenu from "@/components/cobalt/cobaltLoaderForMenu"
import { transformStyles } from '@/components/constants/Matrices';
import { loadPageConfigurations } from '@/components/redux/reducers/ProfitCenterReducer';
import { Divider } from '@/components/ui/divider';
import AntDesign from '@expo/vector-icons/AntDesign';

const pageId = 'Login';
class MenuOrderUI extends useMenuOrderLogic {


  renderMealTypeList = (mealTypeItem,index) => {
    const {
      mealperiodButtonConfig,
    } = this.state;
    const MealperiodButtonConfigStyles=transformStyles(mealperiodButtonConfig?.Styles);
      const BgActivecolor =mealperiodButtonConfig?.BgActivecolor  ||  "#00C6FF";
      const BgInactivecolor =mealperiodButtonConfig?.BgInActivecolor  ||  "#ECECEC";
      const TextActivecolor =mealperiodButtonConfig?.TextActivecolor  ||  "#ffffff";
      const TextInctivecolor =mealperiodButtonConfig?.TextInactivecolor  ||  "#717171";
      const Bgopacity= mealperiodButtonConfig?.opacity  ||  0.8;
      const MenuMealType=MealperiodButtonConfigStyles?.MenuMealType || styles.MenuMealType; 
      const MealTypeLabel=MealperiodButtonConfigStyles?.mealTypeLabel || styles.mealTypeLabel;
      const TimeDurationTxt=MealperiodButtonConfigStyles?.timeDurationTxt || styles.timeDurationTxt;

    // const lastIndex = this.state.mealPeriods.length -1 === index
    return (
      <UI.ConnectedCbBox id="MealTypeContainer" pageId={'MenuOrder'} style={styles.mealTypeContainer}>
        <UI.TouchableOpacity activeOpacity={0.6}  onPress={() => {this.setMealType(mealTypeItem, mealTypeItem.IsEnabled)}}>
        <UI.Box  style={[MenuMealType,mealTypeItem.IsSelect === 1 ? { backgroundColor: BgActivecolor}:{ backgroundColor: BgInactivecolor,opacity: Bgopacity}]}  >
        <UI.Text   style={[MealTypeLabel,{ color: mealTypeItem.IsSelect === 1 ? TextActivecolor : TextInctivecolor }]}  >
            {mealTypeItem.MealPeriod_Name?.toUpperCase()}
        </UI.Text>
          <UI.Text style={[TimeDurationTxt,{ color: mealTypeItem.IsSelect === 1 ? TextActivecolor : TextInctivecolor }]}          >
            {mealTypeItem.Time}
          </UI.Text>
          </UI.Box>
        </UI.TouchableOpacity>
        </UI.ConnectedCbBox>
    );
  }

  renderMenuOrderItems = () => {
    if (this.state.errorMessage === "") {
      if (this.state.loading) {
        return (
          // <CbLoaderForMenu />
          <></>
        )
      } else {
        return (
          <>
            <UI.Box style={styles.topContainer2}>
              <UI.ScrollView
                horizontal={true}
                style={styles.topContainer}
                showsHorizontalScrollIndicator={false}
              >
                {this.state.mealPeriods?.map((item, index) => {
                  return this.renderMealTypeList(item, index);
                })}
              </UI.ScrollView>
            </UI.Box>

            {this.renderCategoryMainList()}

            {this.props.cartData?.length > 0 && <UI.ConnectedCbFloatingButton id="CartButton" pageId="MenuOrder"  props={this.props} />}
          </>
        )
      }
    } else {
      return (
        <UI.Text style={styles.emptyMealTxt}>{this.state.errorMessage}</UI.Text>
      )
    }
  }

  renderMenuCategoryList = (item) => {
    const {mealperiodButtonConfig} = this.state
    const MealperiodButtonConfigStyles=transformStyles(mealperiodButtonConfig?.Styles);
    const ActiveBottomStyle=MealperiodButtonConfigStyles?.bottomStyle || styles.bottomStyle;
    return (
      <UI.Box>
        <UI.TouchableOpacity
          style={styles.categoryBtn}
          activeOpacity={0.6}
          onPress={() => this.handleCategoryClick(item.Category_ID)}
        >
            <UI.ConnectedCbText id="CategoryText" pageId="MenuOrder" style={styles.categoryText}>
                {item.Category_Name?.toUpperCase()}
            </UI.ConnectedCbText>
          {item.CategoryIsSelect === 1 && (
             <UI.ConnectedCbBox id="BottomStyle" pageId="MenuOrder"
             style={ActiveBottomStyle} />
          )}
        </UI.TouchableOpacity>
      </UI.Box>
    );
  }

  showActiveAvailableColor = (isAvailable:number,IsDisable:number) => {
    const Activecolor =this.state.categoryMainListConfig?.Activecolor  ||  "#4B5154";
    const InActivecolor =this.state.categoryMainListConfig?.InActivecolor  ||  "#4B515469";
    return { color: isAvailable === 1 &&IsDisable===0  ? Activecolor : InActivecolor };
  };
 
  renderMenuOrderItemsList = ({ item }) => {
    const subMenuItem = item
    return (
      <UI.Box>
        {item.SubMenu_Name !== null && (
          <UI.TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardMainContainer}
            onPress={() => this.toggleSubmenu(subMenuItem.SubMenu_ID)}
          >
            <UI.ConnectedCbText id="ItemCategoryLabel" pageId="MenuOrder" style={styles.itemCategoryLabel}>
              {item.SubMenu_Name}
            </UI.ConnectedCbText>
            {this.state.expandedSubmenus[subMenuItem.SubMenu_ID] ? (
              <AntDesign name="up" size={20} color="#5773a2" />
            ) : (
              <AntDesign name="down" size={20} color="#5773a2" />
            )}
          </UI.TouchableOpacity>
        )}
        <UI.Box style={styles.mainItemContainer}>
          {this.state.expandedSubmenus[subMenuItem.SubMenu_ID] && (
            <UI.FlatList
              data={item?.items}
              keyExtractor={(item) => `Menu-Id-${item.Item_ID}`}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={100}
              scrollEnabled={false}
              initialNumToRender={10}
              onEndReachedThreshold={0.1}
              renderItem={({ item, index }) => {
                let box = item;
                const lastItem =
                  index === subMenuItem.items?.length - 1;
                const isExpanded = this.state.expandedIds.includes(box?.Item_ID);
                return (
                  <UI.TouchableOpacity
                    activeOpacity={0.5}
                    disabled={(box.IsAvailable === 0 && box.IsDisable === 1)}
                    onPress={() => this.throttledOpenItemDetails(box)}
                    key={box?.Item_ID}
                    style={[
                      styles.subContainer,
                      {
                        opacity:
                          (box?.IsAvailable === 1 &&
                            box?.IsDisable === 0)
                            ? 1
                            : 0.8,
                      },
                    ]}
                  >
                    <UI.ConnectedCbBox id="ItemrowContainer" pageId="MenuOrder" style={styles.rowContainer}>
                      <UI.ConnectedCbBox id="ItemtextContainer" pageId="MenuOrder" style={[styles.textContainer]}>
                        <UI.ConnectedCbText id="Itemnametext" pageId="MenuOrder"
                          numberOfLines={0}
                          style={[
                            styles.mealTypeTitle,
                            this.showActiveAvailableColor(box?.IsAvailable, box?.IsDisable),
                          ]}
                          Conditionalstyle={this.showActiveAvailableColor(box?.IsAvailable, box?.IsDisable)}
                        >
                          {box?.Item_Name}
                        </UI.ConnectedCbText>
                        <UI.ConnectedCbText id="Itempricetext" pageId="MenuOrder" numberOfLines={isExpanded ? undefined : 2}
                          style={[styles.priceTxt, this.showActiveAvailableColor(box.IsAvailable, box.IsDisable)]}
                          Conditionalstyle={this.showActiveAvailableColor(box?.IsAvailable, box?.IsDisable)}
                        >
                          {`$${box?.Price != null ? box?.Price : 0}`}
                        </UI.ConnectedCbText>
                        <UI.ConnectedCbText id="Itemdescriptiontext" pageId="MenuOrder"
                          numberOfLines={isExpanded ? undefined : 2}
                          style={[styles.descriptionTxt, this.showActiveAvailableColor(box.IsAvailable, box.IsDisable),
                          {
                            textAlign: "left",
                            letterSpacing: -0.5,
                          },
                          ]}
                          Conditionalstyle={this.showActiveAvailableColor(box?.IsAvailable, box?.IsDisable)}
                        >
                          {box?.Description}
                        </UI.ConnectedCbText>
                        {box?.Description?.length > 68 && (
                          <UI.TouchableOpacity onPress={() =>
                            this.handleReadMoreToggle(box.Item_ID)
                          }>
                            <UI.ConnectedCbText id="Itemunderlinetext" pageId="MenuOrder" style={styles.underLineTxt}>
                              {isExpanded ? "Show Less" : "Read More"}
                            </UI.ConnectedCbText>
                          </UI.TouchableOpacity>

                        )}
                      </UI.ConnectedCbBox>

                      <UI.Box style={styles.imageContainer}>
                        <UI.Box
                          style={{
                            backgroundColor:
                              "rgba(255, 255, 255, 0.2)",
                          }}
                          // disabled={box.IsAvailable === 0 && box.IsDisable === 1}
                        >
                          <Image
                            source={{ uri: item.ImageUrl }}
                            style={[
                              styles.mealTypeImg,
                              box.IsAvailable === 0 &&
                              box.IsDisable === 1 && {
                                opacity: 0.4,
                              },
                            ]}
                          />
                        </UI.Box>
                        {
                          this.renderAddToCartBtn(box)
                        }
                      </UI.Box>
                    </UI.ConnectedCbBox>

                    {!lastItem && (
                      <UI.Box style={styles.horizontalLine}>
                        <Divider />
                      </UI.Box>
                    )}
                  </UI.TouchableOpacity>
                );
              }}
            />

          )}
        </UI.Box>
      </UI.Box>
    );
  }


  renderCategoryMainList = () => {
    const {
      categoryMainListConfig
    } = this.state;
    const CategoryMainListConfigStyles=transformStyles(categoryMainListConfig?.Styles);
    const Activecolor =categoryMainListConfig?.Activecolor  ||  "#4B5154";
    const InActivecolor =categoryMainListConfig?.InActivecolor  ||  "#4B515469";
    const EmptyLabeltext=categoryMainListConfig?.EmptyLabeltext  ||  "No items available";
    const ChevronIconColor=categoryMainListConfig?.ChevronIconColor  ||  "#5773a2";
    const ChevronIconSize=categoryMainListConfig?.ChevronIconSize  ||  "xl";
    const Activeopacity=categoryMainListConfig?.Activeopacity  ||  1;
    const InActiveopacity=categoryMainListConfig?.InActiveopacity  ||  0.8;
    const Descmore=categoryMainListConfig?.Descmore ||  "Read More";
    const Descless=categoryMainListConfig?.Descless || "Show Less";
    const Imageopacity=categoryMainListConfig?.Imageopacity || 0.4;
    const MainBoxContainer=CategoryMainListConfigStyles?.mainBoxContainer || styles.mainBoxContainer; 
    const BottomMiddleContainer=CategoryMainListConfigStyles?.bottomMiddleContainer || styles.bottomMiddleContainer; 
    const MainContainerList=CategoryMainListConfigStyles?.mainContainerList || styles.mainContainerList; 
    const EmptyBoxContainer=CategoryMainListConfigStyles?.emptyBoxContainer || styles.emptyBoxContainer; 
    const EmptyMealTxt=CategoryMainListConfigStyles?.emptyMealTxt || styles.emptyMealTxt; 
    const CardMainContainer=CategoryMainListConfigStyles?.cardMainContainer || styles.cardMainContainer; 
    const Chevronicon=CategoryMainListConfigStyles?.Chevronicon || styles.icon;
    const SubContainer=CategoryMainListConfigStyles?.subContainer || styles.subContainer;
    const MealTypeTitle=CategoryMainListConfigStyles?.mealTypeTitle || styles.mealTypeTitle;
    const PriceTxt=CategoryMainListConfigStyles?.priceTxt || styles.priceTxt;
    const DescriptionTxt=CategoryMainListConfigStyles?.descriptionTxt || styles.descriptionTxt;
    const UnderLineTxt=CategoryMainListConfigStyles?.underLineTxt || styles.underLineTxt;
    const ImageContainer=CategoryMainListConfigStyles?.imageContainer || styles.imageContainer;
    const Itemimage=CategoryMainListConfigStyles?.itemImage || styles.itemImage;
    const MealTypeImg=CategoryMainListConfigStyles?.mealTypeImg || styles.mealTypeImg;
    


    const showActiveAvailableColor = (isAvailable,IsDisable) => {
      return { color: isAvailable === 1 &&IsDisable===0  ? Activecolor : InActivecolor };
    };
   
    if (false) {
      return (
        <UI.ConnectedCbBox id="EmptyListContainer" pageId="MenuOrder" style={styles.emptyListContainer}>
          <UI.ConnectedCbText id="EmptyMealTxt" pageId="MenuOrder" style={styles.emptyMealTxt}></UI.ConnectedCbText>
        </UI.ConnectedCbBox>
      );
    }

    return (
      <UI.Box style={MainBoxContainer}>
      {this.props.searchQuery.trim() === "" && (
          <UI.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContainer}
            keyboardShouldPersistTaps="handled"
            ref={this.categoryScrollRef}
          >
            {this.state.selectedCategory?.map((group) => this.renderMenuCategoryList(group))}
          </UI.ScrollView>
        )}

        <UI.ScrollView style={BottomMiddleContainer}
          ref={this.scrollViewRef}
          onScroll={this.handleScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={MainContainerList}
        >
          {
             this.state.selectedCategory?.map((category) => {
              return (
                <UI.FlatList
                  onLayout={(e) => {
                    this.handleLayout(category.Category_ID, e);
                    this.handleItemLayout(category.Category_ID, e);
                  }}
                  data={category?.submenus}
                  windowSize={50}
                  keyExtractor={(item) => `Menu-Item-${item.SubMenu_ID}`}
                  removeClippedSubviews={true}
                  updateCellsBatchingPeriod={100}
                  scrollEnabled={false}
                  onEndReachedThreshold={0.8}
                  renderItem={this.renderMenuOrderItemsList}
                />
                  );
                })
          }
        </UI.ScrollView>
      </UI.Box>
    );
  };


  renderAddToCartBtn = (item) => {
    const cartItem = this.props.cartData && this.props.cartData?.find((values) => values.Item_ID === item?.Item_ID);
    const cartQuantity = cartItem ? cartItem?.quantity : 0
    const modifierCartItems = this.props.modifierCartItemData && this.props.modifierCartItemData?.find((values) => values?.Item_ID === item?.Item_ID);
    const modifierQuantity = modifierCartItems? modifierCartItems?.quantity : 0
    const commonStyles = (
      isAvailable:number,
      IsDisable:number,
      primaryColor:string,
      secondaryColor:string
    ) => {
      if (isAvailable === 1 && IsDisable === 0) {
        return primaryColor;
      } else {
        return secondaryColor;
      }
    };

    const renderAddCartUi = () => {
      const {
        mOAddtoCartButtonConfig,
      } = this.state;
      const MOAddtoCartButtonConfigStyles=transformStyles(mOAddtoCartButtonConfig?.Styles);
      const Activecolor =mOAddtoCartButtonConfig?.Activecolor  ||  "#5773a2";
      const InActivecolor =mOAddtoCartButtonConfig?.InActivecolor  ||  "#ABABAB";
      const AddIconSource =mOAddtoCartButtonConfig?.AddIconSource ;
      const RemoveIconSource =mOAddtoCartButtonConfig?.RemoveIconSource ;
      const DeleteIconSource= mOAddtoCartButtonConfig?.DeleteIconSource ;
      const OperationBtn3=MOAddtoCartButtonConfigStyles?.operationBtn3 || styles.operationBtn3; 
      const OperationBtn2=MOAddtoCartButtonConfigStyles?.operationBtn2 || styles.operationBtn2;
      const OperationBtn=MOAddtoCartButtonConfigStyles?.operationBtn || styles.operationBtn;
      const AddCartIcons=MOAddtoCartButtonConfigStyles?.addCartIcons || styles.addCartIcons;
      const IconBtn=MOAddtoCartButtonConfigStyles?.iconBtn || styles.iconBtn;
      const QuantityTxt=MOAddtoCartButtonConfigStyles?.quantityTxt || styles.quantityTxt;
     
      if(cartQuantity === 0 && modifierQuantity === 0){
        return(
          <UI.Box style={OperationBtn3}>
          <UI.TouchableOpacity
        disabled={this.state.disabledItems[item.Item_ID] || item.IsAvailable !== 1 || item.IsDisable !== 0}
            onPress={() => this.throttledHandleAddToCartBtn(item)}
            style={[OperationBtn2,{ borderColor: commonStyles(item.IsAvailable, item.IsDisable, Activecolor,InActivecolor)}]} >
              { AddIconSource ? <Image source={{ uri: AddIconSource}} style={AddCartIcons} /> : <Image source={require('@/assets/images/icons/Plus_Icon3x.png')} style={AddCartIcons}/> }
          </UI.TouchableOpacity>
        </UI.Box>
        )
      }else if(item.IsDisable === 1){
        return(
          <UI.Box style={OperationBtn3}>
          <UI.TouchableOpacity
disabled={this.state.disabledItems[item.Item_ID] || item.IsAvailable !== 1 || item.IsDisable !== 0}
            onPress={() => this.throttledHandleAddToCartBtn(item)}
            style={[ OperationBtn2,{ borderColor: commonStyles(item.IsAvailable,item.IsDisable, Activecolor,InActivecolor)}]}>
              { AddIconSource ? <Image source={{ uri: AddIconSource}} style={AddCartIcons} /> : <Image source={require('@/assets/images/icons/Plus_Icon3x.png')} style={AddCartIcons}/> }
          </UI.TouchableOpacity>
        </UI.Box>
        )
      }else{
        return(
          <UI.Box style={OperationBtn}>
            <UI.TouchableOpacity style={IconBtn}  onPress={() => this.modifierIncDecBtn(item, cartQuantity,modifierQuantity,"decrement")}>
              {
                cartQuantity === 1 ? ( DeleteIconSource ? (<Image source={{ uri: DeleteIconSource}} style={AddCartIcons} />) :(<Image source={require('@/assets/images/icons/Trash_Icon3x.png')} style={AddCartIcons}/>))
                : (RemoveIconSource ? (<Image source={{ uri: RemoveIconSource}} style={AddCartIcons} />) : (<Image source={require('@/assets/images/icons/Minus_Icon3x.png')} style={AddCartIcons}/>))
              }
            </UI.TouchableOpacity>
            <UI.Text style={QuantityTxt}>{cartQuantity === 0?1:cartQuantity}</UI.Text>
            <UI.TouchableOpacity  style={IconBtn} onPress={() => this.modifierIncDecBtn(item, cartQuantity,modifierQuantity,"increment")}>
                 { AddIconSource ? <Image source={{ uri: AddIconSource}} style={AddCartIcons} /> : <Image source={require('@/assets/images/icons/Plus_Icon3x.png')} style={AddCartIcons}/> }
            </UI.TouchableOpacity>
          </UI.Box>
        )
      }
    }

    return (
      <>
        {renderAddCartUi()}
      </>
    );
  };

  render() {
    const {isRecentOrderOpen,isSearchActive} = this.state
    return (
      <UI.Box style={{flex:1}}>
    <UI.ConnectedCbBox id="MenuorderContainer" pageId={'MenuOrder'} style={styles.mainContainer}>
    <UI.ConnectedCbHeader navigation={this.props.navigation} goBack={() => this.props?.navigation.goBack()} headerTitle={"Menu Order"}/>
    <UI.ConnectedCbBox id="MainHeaderContainer" pageId={'MenuOrder'} style={styles.mainHeaderContainer}>
      {
        !isRecentOrderOpen && <UI.ConnectedCbSearchbox id="ItemSearch"   onSearch={(val:string) => this.props.handleOnSearch(val)} onSearchActivate={() => this.handleChangeState()}  pageId={'MenuOrder'} isRecentOrderOpen={isRecentOrderOpen && true}/>
      }
      {!isSearchActive && (
        <UI.TouchableOpacity style={[styles.recentOrderContainer]} onPress={() => this.props.navigation?.navigate("Recentorders")}>
          <UI.ConnectedCbBox id="RecentOrderBox" pageId={'MenuOrder'} style={styles.recentOrderBox}>
             <UI.ConnectedCbText id="ROText" pageId={'MenuOrder'}  style={styles.recentOrderTxt}>Recent Order</UI.ConnectedCbText>    
          </UI.ConnectedCbBox>  
          <UI.ConnectedCbImage id="RoNavIcon" pageId={'MenuOrder'} imageJsx={<Image source={require('@/assets/images/icons/RONav.png')} style={styles.dropdownIcon}/>}/>        
        </UI.TouchableOpacity>
      )}
    </UI.ConnectedCbBox>
     

      {this.renderMenuOrderItems()}

      {this.props.isExitProfitCenter && (
        <UI.Modal
          visible={this.props.isExitProfitCenter}
          transparent
          animationType="fade"
          onRequestClose={this.props.openCartRemovePopup}
        >
          <UI.ConnectedCbBox id="Modalview" pageId={'MenuOrder'}
            style={styles.modalContainer}
            onPress={this.props.openCartRemovePopup}
          />

          <UI.ConnectedCbBox id="ConfirmModal" pageId={'MenuOrder'} style={styles.confirmMdl}>
            <UI.ConnectedCbBox id="InnerModal" pageId={'MenuOrder'}  style={styles.innerModal}>
              <UI.ConnectedCbBox id="InnerModalMsgContainer" pageId={'MenuOrder'} style={styles.innerModalMsgContainer}>
                <UI.ConnectedCbText id="InnerModalAlertText" pageId={'MenuOrder'} style={styles.innerModalAlertTxt}>Are you sure you want to leave the profit center? All items in your cart will be deleted if you proceed</UI.ConnectedCbText>
                <UI.ConnectedCbBox id="DiscardButtoncontainer" pageId={'MenuOrder'} style={styles.discardBtn}>
                  <UI.TouchableOpacity onPress={this.props.openCartRemovePopup} >
                    <UI.ConnectedCbBox id="ModalNoYesBtn" pageId={'MenuOrder'} style={styles.modalNoYesBtn}>
                        <UI.ConnectedCbText id="ModalNoBtnText" pageId={'MenuOrder'} style={styles.modalNoYesBtnTxt}>NO</UI.ConnectedCbText>
                    </UI.ConnectedCbBox>
                  </UI.TouchableOpacity>
                  <UI.TouchableOpacity onPress={() => this.removeCartItems()} >
                    <UI.ConnectedCbBox id="ModalNoYesBtn" pageId={'MenuOrder'} style={styles.modalNoYesBtn}>
                      <UI.ConnectedCbText id="ModalYesBtnText" pageId={'MenuOrder'} style={styles.modalNoYesBtnTxt}>Yes</UI.ConnectedCbText>
                    </UI.ConnectedCbBox>
                  </UI.TouchableOpacity>
                </UI.ConnectedCbBox>
              </UI.ConnectedCbBox>
            </UI.ConnectedCbBox>
          </UI.ConnectedCbBox>
        </UI.Modal>
      )}
      {
        this.state.apiLoader && 
        <UI.Box style={styles.menuLoaderModal}>
          <CbLoaderForMenu />
        </UI.Box>
      }
    </UI.ConnectedCbBox>


        {
          this.props.itemDataVisible &&
          <UI.Modal
            visible={this.props.itemDataVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={this.props.closePreviewModal}
          >
              <UI.ConnectedCbBox id="ModalBackground" pageId="MenuOrder" style={styles.modalBackground}>
          <UI.TouchableOpacity
            onPress={() => this.handleCloseItemDetails()}
            style={styles.crossIcon}
          >
            <UI.ConnectedCbBox id="CloseIconContainer" pageId="MenuOrder" style={styles.CloseIconContainer} >
              <UI.ConnectedCbImage id="CloseIcon" pageId={'MenuOrder'} imageJsx={<Image source={require('@/assets/images/icons/Modal_Close.png')} style={styles.closeIcon} />} />
            </UI.ConnectedCbBox>
          </UI.TouchableOpacity>
          <UI.ConnectedCbBox id="ModiferItems" pageId="MenuOrder" style={styles.modiferItems}>
            {/* <ItemModifier isRecentOrder={false} /> */}
          </UI.ConnectedCbBox>
        </UI.ConnectedCbBox>
          </UI.Modal>
        }
      </UI.Box>   
    );
  }
}

const mapStateToProps = (state:RootState) => {
  return {
    searchQuery:state.MenuOrder.searchQuery,
    menuOrderData:state.MenuOrder.menuOrderData,
    cartData:state.Cart.cartData,
    modifierCartItemData:state.Cart.modifierCartItemData,
    isExitProfitCenter:state.MenuOrder.isExitProfitCenter,
    itemDataVisible:state.MenuOrder.itemDataVisible
  }
}
const mapDispatchToProps = {
  handleOnSearch,
  loadPageConfigurations,
  storeMenuOrderData,
  openCartRemovePopup,
  closePreviewModal
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuOrderUI)

