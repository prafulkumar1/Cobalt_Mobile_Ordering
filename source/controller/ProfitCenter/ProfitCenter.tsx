import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postApiCall } from '@/components/utlis/api';
import { navigateToScreen } from '@/components/constants/Navigations';

const pageId = 'ProfitCenter';

interface IProps {
  navigation: any;
  setAppConfigJsonData:(config:any) => void
  route:any
}

interface IState {
  profitCenterData: any;
  loading: boolean;
  configloading:boolean
}

export default class ProfitCenterLogic extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      profitCenterData: null,
      loading: false,
      configloading:false
    };
  }

  componentDidMount() {
    this.getConfigurations();
  }

  getConfigurations = async () => {
    this.setState({configloading:true})
    const AppConfigJsonData = await postApiCall(
      'UI_CONFIGURATIONS',
      'GET_UI_CONFIGURATIONS',
      {}
    );
    if (AppConfigJsonData.statusCode === 200) {
        this.props.setAppConfigJsonData(AppConfigJsonData?.response?.Data)
        this.setState({configloading:false},() => {
            this.getProfitCenterList();
        })
    }
  };

  getProfitCenterList = async () => {
    this.setState({ loading: true });

    const params = {
      FilterDate: '',
      FilterTime: '',
    };

    const profitCenterResponseData = await postApiCall(
      'PROFIT_CENTER',
      'GET_PROFIT_CENTERS',
      params
    );

    if (profitCenterResponseData.statusCode === 200) {
      const mealPeriods = profitCenterResponseData.response?.MealPeriodData || [];
      const locationId = global.location_id;
      const fetchTrigger = global.fetchTrigger;

      const matchedLocation = mealPeriods.find(
        (location) => location.LocationId === locationId
      );

      if (matchedLocation?.LocationId && fetchTrigger) {
        navigateToScreen(this.props, 'Recentorders', true, {
          profileCenterTile: matchedLocation.LocationName,
          LocationId: matchedLocation.LocationId,
        });
      } else if (mealPeriods.length === 1 && mealPeriods[0].Isnavigate === 1) {
        await AsyncStorage.setItem('profit_center', JSON.stringify(mealPeriods[0]));

        navigateToScreen(this.props, 'MenuOrder', true, {
          profileCenterTile: mealPeriods[0].LocationName,
          LocationId: mealPeriods[0].LocationId,
          fromSingleProfitCenter: true,
        });
      }

      this.setState({ profitCenterData: profitCenterResponseData.response });
    }

    this.setState({ loading: false });
  };

  removeCartItems = async () => {
    await AsyncStorage.removeItem('cart_data');
  };

  navigateToMenuOrder = async (item: any) => {
    if (item.Isnavigate === 1) {
      await AsyncStorage.setItem('profit_center', JSON.stringify(item));
      await this.removeCartItems();
      navigateToScreen(this.props, 'MenuOrder', true, {
        profileCenterTile: item.LocationName,
        LocationId: item.LocationId,
      });
    }
  };
}
