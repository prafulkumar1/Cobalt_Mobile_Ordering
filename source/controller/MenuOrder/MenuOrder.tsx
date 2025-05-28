import { throttle } from '@/components/constants/Matrices';
import { navigateToScreen } from '@/components/constants/Navigations';
import { IMenuItem } from '@/components/constants/Types';
import { postApiCall } from '@/components/utlis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react'
import { Alert, Dimensions, InteractionManager } from 'react-native';
const { width, height } = Dimensions.get('window');
const pageId='Login';


interface IState {
  isRecentOrderOpen: boolean;
  searchQuery: string;
  isSearchActive: boolean;
  loading: boolean;
  errorMessage: string;
  mealPeriods: any[];
  categoryData: IMenuItem[];
  selectedCategory: any;
  expandedSubmenus: { [key: string]: boolean };
  itemPositions: { [key: string]: number };
  expandedIds: any;
  apiLoader: boolean;
  disabledItems: { [key: string]: boolean };
  mealperiodButtonConfig: any;
  mOAddtoCartButtonConfig: any;
  categoryMainListConfig: any;
  toastDetails: {
    isToastVisiable: boolean
    toastMessage:string
  },
}
interface IProps{
  navigation?:{
    navigate?:(params:string) => void
    goBack?:() => void
}
handleOnSearch?:(val:string) => void
loadPageConfigurations?:(payload: {pageID:string,controlId:string}) =>void
searchQuery:string
storeMenuOrderData:(payload:any) =>void
menuOrderData:IMenuItem[]
cartData:any
modifierCartItemData:any
isExitProfitCenter:boolean
openCartRemovePopup:() =>void
itemDataVisible:boolean
closePreviewModal:() =>void
}
interface SS{}

const timeoutManager: { [key: string]: any } = {
  menuOrderTimer1: null,
  menuOrderTimer2: null,
  menuOrderTimer3: null,
  menuOrderTimer4: null,
  menuOrderTimer5: null,
};

const clearAllTimeouts = () => {
  for (const key in timeoutManager) {
    if (timeoutManager[key]) {
      clearTimeout(timeoutManager[key]);
      timeoutManager[key] = null;
    }
  }
};
export default class useMenuOrderLogic extends Component<IProps,IState,SS> {
  scrollViewRef:any
  categoryScrollRef:any
  categoryPositions:any
  categoryRefs:any
    constructor(props:IProps){
      super(props)
      this.state ={
        isRecentOrderOpen:false,
        searchQuery:"",
        isSearchActive:false,
        loading: false,
        errorMessage: '',
        mealPeriods: [],
        categoryData: [],
        selectedCategory: null,
        expandedSubmenus: {},
        itemPositions: {},
        expandedIds: [],
        apiLoader: false,
        disabledItems: {},
        mealperiodButtonConfig: null,
        mOAddtoCartButtonConfig: null,
        categoryMainListConfig: null,
        toastDetails: {
          isToastVisiable: false,
          toastMessage: "",
        },
      }
      this.scrollViewRef = React.createRef();
    this.categoryScrollRef = React.createRef();

    this.categoryPositions = {};
    this.categoryRefs = {};
    }
    
    componentDidMount() {
      this.loadPageConfig()
      this.getMenuOrderList()
    }

    loadPageConfig = async() => {
      try {
        const ControlConfig = this.props?.loadPageConfigurations({
          pageID: "MenuOrder",
          controlId: "MealperiodButton",
        });
        const containerConfig = await this.props?.loadPageConfigurations({
          pageID: "MenuOrder",
          controlId: "",
        })
        const mOAddtoCartButton = await this.props?.loadPageConfigurations({
          pageID: "MenuOrder",
          controlId: "MOAddtoCartButton",
        })
        const categoryMainList = await this.props?.loadPageConfigurations({
          pageID: "MenuOrder",
          controlId: "CategoryMainList",
        })
        this.setState({
          mealperiodButtonConfig: containerConfig,
          mOAddtoCartButtonConfig: mOAddtoCartButton,
          categoryMainListConfig: categoryMainList
        });
      } catch (error) {}
    }
  
   
    componentWillUnmount() {
      clearAllTimeouts();
    }
    
    handleChangeState = () => {
      this.setState({isSearchActive:!this.state.isSearchActive})
    }


    getMenuOrderList = async () => {
      this.setState({ loading: true });
  
      const getProfitCenterItem = await AsyncStorage.getItem("profit_center");
      const getProfitCenterId = getProfitCenterItem !== null ? JSON.parse(getProfitCenterItem) : null;
  
      const params = {
        "LocationId": `${getProfitCenterId?.LocationId}`,
        "MealPeriod_Id": "",
        "Category_Id": "",
        "Search": ""
      };

      let menuOrderResponseData = await postApiCall("MENU_ORDER", "GET_MENU_ORDER_LIST", params);

      if (menuOrderResponseData?.response?.ResponseCode === "Fail") {
        this.setState({ errorMessage: menuOrderResponseData.response.ResponseMessage });
      } else if (menuOrderResponseData === undefined) {
        this.setState({ errorMessage: "Something went wrong!Please try again", loading: false });
      } else {
        const allItems = menuOrderResponseData.response?.MenuItems || [];
  

        const uniqueMealPeriods = allItems
          ?.filter((item) => item.MealPeriod_Id && item.MealPeriod_Name)
          .reduce((acc, current) => {
            const isDuplicate = acc.some((item) => item.MealPeriod_Id === current.MealPeriod_Id);
            if (!isDuplicate) {
              acc.push({
                MealPeriod_Name: current.MealPeriod_Name,
                IsSelect: current.MealPeriodIsSelect,
                Time: current.Time,
                MealPeriod_Id: current.MealPeriod_Id,
                IsEnabled: current.IsEnabled
              });
            }
            return acc;
          }, []);
  
        const currentMealPeriodId = allItems
          .filter((item:any) => item.MealPeriodIsSelect === 1)
          .map((item:any) => item.MealPeriod_Id);
  
        await AsyncStorage.setItem("MealPeriod_Id", JSON.stringify(currentMealPeriodId));
  
        this.requiredDataFormat(allItems);
        this.props.storeMenuOrderData(allItems)
        this.setState({
          mealPeriods: uniqueMealPeriods,
          categoryData: allItems,
          expandedSubmenus: allItems.reduce((acc, category) => {
            acc[category?.SubMenu_ID] = true;
            return acc;
          }, {}),
          loading: false
        });
      }
    }
  
    requiredDataFormat = (responseData:any) => {
      const groupedCategories = responseData
        ?.filter((items:any) => items.MealPeriodIsSelect === 1)
        .reduce((acc, item, index) => {
          let category = acc?.find(cat => cat.Category_ID === item.Category_ID);
  
          if (!category) {
            category = {
              Category_ID: item.Category_ID,
              Category_Name: item.Category_Name,
              CategoryIsSelect: index === 0 ? 1 : 0,
              submenus: [],
            };
            acc.push(category);
          }
  
          let submenu = category.submenus?.find((sub: { SubMenu_ID: any; }) => sub.SubMenu_ID === item.SubMenu_ID);
  
          if (!submenu) {
            submenu = {
              SubMenu_ID: item.SubMenu_ID,
              SubMenu_Name: item.SubMenu_Name,
              items: [],
            };
            category.submenus.push(submenu);
          }
  
          submenu.items.push({
            Item_ID: item.Item_ID,
            Item_Name: item.Item_Name,
            Description: item.Description,
            Price: item.Price,
            ImageUrl: item.ImageUrl,
            IsAvailable: item.IsAvailable,
            IsDisable: item.IsDisable,
            IsFavourite: 0,
          });
  
          return acc;
        }, []);
      
      this.setState({ selectedCategory: groupedCategories });
    }

    setMealType = (mealTypeItem: any, IsEnabled: number) => {
      if (IsEnabled === 1) {
        const { mealPeriods } = this.state;
    
        const uniqueMealPeriods = mealPeriods?.map((item: any) => ({
          ...item,
          IsSelect: item.MealPeriod_Id === mealTypeItem.MealPeriod_Id ? 1 : 0,
        }));
    
        const responseData = this.props.menuOrderData && this.props.menuOrderData
          ?.filter((val: any) => val.MealPeriod_Name === mealTypeItem.MealPeriod_Name)
          ?.map((item: any) => ({
            ...item,
            MealPeriodIsSelect: 1,
          }));
    
        this.requiredDataFormat(responseData);
        this.setState({ mealPeriods: uniqueMealPeriods });
      }
    };

    handleReadMoreToggle = (id: string | number) => {
      const { expandedIds } = this.state;
    
      const isExpanded = expandedIds.includes(id);
      const updatedExpandedIds = isExpanded
        ? expandedIds.filter((expandedId: string | number) => expandedId !== id)
        : [...expandedIds, id];
    
      this.setState({ expandedIds: updatedExpandedIds });
    };

    toggleSubmenu = (categoryId: string | number) => {
      this.setState((prevState: Readonly<any>) => ({
        expandedSubmenus: {
          ...prevState.expandedSubmenus,
          [categoryId]: !prevState.expandedSubmenus[categoryId],
        },
      }));
    };

    postQuantityApiCall = async (quantity, itemId) => {
      try {
        const getProfitCenterItem = await AsyncStorage.getItem("profit_center")
        let getProfitCenterId = getProfitCenterItem !== null && JSON.parse(getProfitCenterItem)
        const params = {
          "Item_ID": itemId,
          "Item_Quantity": quantity,
          "Location_Id": `${getProfitCenterId.LocationId}`
        }
        let quantityInfo = await postApiCall("MENU_ORDER", "GET_MENU_ORDER_STATUS", params)
        return quantityInfo
      } catch (err) { }
    }


  openItemDetails = async (box: any) => {
    if (box.IsAvailable === 1 && box.IsDisable === 0) {
      this.setState({ apiLoader: true });
  
      try {
        const quantityInfo = await this.postQuantityApiCall(1, box?.Item_ID);
  
        if (quantityInfo?.response) {
          // this.setState({ modifierApiResponse: quantityInfo.response });
          // this.storeSingleItem({ ...box, response: quantityInfo.response });
          // this.increaseQuantity(box);
          // this.setState({ itemDataVisible: true });
        }
      } finally {
        this.setState({ apiLoader: false });
      }
    }
  };

  throttledOpenItemDetails = throttle(this.openItemDetails, 5000);

  handleAddToCartBtn = async (mealItemDetails: any) => {
    const itemId = mealItemDetails?.Item_ID;
  
    this.setState((prevState: any) => ({
      disabledItems: {
        ...prevState.disabledItems,
        [itemId]: true,
      },
      apiLoader: true,
    }));
  
    let quantityInfo = await this.postQuantityApiCall(1, itemId);
  
    if (quantityInfo.statusCode === 200) {
      // this.setState({ modifierApiResponse: quantityInfo?.response });
  
      if (quantityInfo?.response?.IsModifierAvailable === 1) {
        // this.storeSingleItem(mealItemDetails);
        // if (this.state.itemDataVisible) {
        //   // this.increaseQuantity(mealItemDetails, false);
        // } else {
        //   // this.increaseQuantity(mealItemDetails, false);
        //   // this.setState({ itemDataVisible: true });
        // }
      } else {
        // this.addItemToCartBtn(mealItemDetails);
      }
  
      this.setState((prevState: any) => ({
        disabledItems: {
          ...prevState.disabledItems,
          [itemId]: false,
        },
      }));
    } else {
      this.setState({
        toastDetails: {
          isToastVisiable: true,
          toastMessage: quantityInfo?.response?.ResponseMessage || "Failed to add item to cart.",
        },
      });
  
      if (timeoutManager.menuOrderTimer5) {
        clearTimeout(timeoutManager.menuOrderTimer5);
        timeoutManager.menuOrderTimer5 = null;
      }
  
      timeoutManager.menuOrderTimer5 = setTimeout(() => {
        this.setState({
          toastDetails: {
            isToastVisiable: false,
            toastMessage: "",
          },
        });
      }, 6000);
  
      this.setState((prevState: any) => ({
        disabledItems: {
          ...prevState.disabledItems,
          [itemId]: false,
        },
      }));
    }
  
    this.setState({ apiLoader: false });
  };


  throttledHandleAddToCartBtn = throttle(this.handleAddToCartBtn, 5000);



  modifierIncDecBtn = async (
    mealItemDetails,
    cartQuantity,
    modifierQuantity,
    operation
  ) => {
    this.setState({ apiLoader: true });
  
    try {
      let isItemAvailableInCart = false;
      this.props.cartData?.forEach((items) => {
        if (items?.Item_ID === mealItemDetails.Item_ID) {
          isItemAvailableInCart = true;
        }
      });
  
      const requiredQuantity = this.state.categoryData.length > 0
        ? operation === "decrement"
          ? modifierQuantity - 1
          : modifierQuantity + 1
        : operation === "decrement"
          ? cartQuantity - 1
          : cartQuantity + 1;
  
      const quantityInfo = await this.postQuantityApiCall(
        requiredQuantity,
        mealItemDetails?.Item_ID
      );
  
      if (quantityInfo.statusCode === 200) {
        const {
          IsModifierAvailable,
          IsAvailable,
          ResponseMessage
        } = quantityInfo?.response;
  
        if (IsModifierAvailable === 1) {
          if (operation === "decrement") {
            // this.updateModifierItemQuantity(mealItemDetails, modifierQuantity - 1);
            if (isItemAvailableInCart) {
              // this.updateCartItemQuantity(mealItemDetails, cartQuantity - 1);
            }
          } else {
            if (IsAvailable === 1) {
              // this.updateModifierItemQuantity(mealItemDetails, modifierQuantity + 1);
              if (isItemAvailableInCart) {
                // this.updateCartItemQuantity(mealItemDetails, cartQuantity + 1);
              }
            } else {
              Alert.alert(ResponseMessage);
            }
          }
        } else {
          if (operation === "decrement") {
            // if (this.state.itemDataVisible) {
            //   this.updateModifierItemQuantity(mealItemDetails, modifierQuantity - 1);
            // } else {
            //   this.updateCartItemQuantity(mealItemDetails, cartQuantity - 1);
            //   this.updateModifierItemQuantity(mealItemDetails, cartQuantity - 1);
            // }
          } else {
            if (IsAvailable === 1) {
              // if (this.state.itemDataVisible) {
              //   this.updateModifierItemQuantity(mealItemDetails, modifierQuantity + 1);
              // } else {
              //   this.updateCartItemQuantity(mealItemDetails, cartQuantity + 1);
              //   this.updateModifierItemQuantity(mealItemDetails, cartQuantity + 1);
              // }
            } else {
              Alert.alert(ResponseMessage);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      this.setState({ apiLoader: false }); // Always hide loader
    }
  };
  
  removeCartItems = async () => {
    navigateToScreen(this.props,"ProfitCenters",false,{isCartItemsRemove:true})
    this.props.openCartRemovePopup()
    // setModifierCartItemData([])
    await AsyncStorage.removeItem('cart_data')
  }



  handleCategoryClick = (categoryId:string) => {
    const yPosition = this.state.itemPositions[categoryId];
    if (yPosition !== undefined && this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo({ y: yPosition, animated: true });

      const updateData = this.state.selectedCategory.map((items) => ({
        ...items,
        CategoryIsSelect: items.Category_ID === categoryId ? 1 : 0,
      }));

      this.setState({ selectedCategory: updateData });
    }
  };

  handleCategoryLayout = (event, categoryId) => {
    const { x } = event?.nativeEvent.layout;
    this.categoryPositions[categoryId] = x;
  };

  updateCategorySelection = (visibleCategoryId) => {
    const updatedCategories = this.state.selectedCategory.map((category) => ({
      ...category,
      CategoryIsSelect: category.Category_ID === visibleCategoryId ? 1 : 0,
    }));

    this.setState({ selectedCategory: updatedCategories });

    const xPosition = this.categoryPositions[visibleCategoryId];
    if (xPosition !== undefined) {
      this.categoryScrollRef.current?.scrollTo({ x: xPosition - 200, animated: true });
    }
  };

  handleLayout = (categoryId:string, event:any) => {
    const layout = event?.nativeEvent.layout;
    this.categoryRefs[categoryId] = layout.y;
  };

  handleScroll = (event) => {
    const scrollY = event?.nativeEvent?.contentOffset.y;
    let visibleCategory = null;

    for (const [categoryId, y] of Object.entries(this.categoryRefs)) {
      if (scrollY >= +y - 50 && scrollY < +y + 50) {
        visibleCategory = categoryId;
        break;
      }
    }

    if (visibleCategory) {
      this.updateCategorySelection(visibleCategory);
    }
  };

  handleItemLayout = (categoryId, event) => {
    const layout = event?.nativeEvent?.layout;
    this.setState((prevState) => ({
      itemPositions: {
        ...prevState.itemPositions,
        [categoryId]: layout.y,
      },
    }));
  };


  handleCloseItemDetails = () => {
    this.props.closePreviewModal()
    // InteractionManager?.runAfterInteractions(() => {
    //   const cartDetails = this.props.cartData?.find((items) => items.Item_ID === singleItemDetails?.Item_ID)
    //   // setFormFieldData("ItemModifier", "", "Comments", "", false);
    
    //   if (selectedModifiers?.length === 0) {
    //     if(cartDetails==undefined){
    //       updateModifierItemQuantity(singleItemDetails, 0);
    //     }
    //     // updateModifierItemQuantity(singleItemDetails, 0);
    //     // setModifiersResponseData([]);
    //     setIsVisible(false);  

    //     closePreviewModal();
    //     setModifierApiResponse(null)  
    //   } else {
    //     setIsVisible(true);
    //   }
    // })
  };


}
