export interface IMenuItem {
    MealPeriod_Id: string;
    MealPeriod_Name: string;
    MealPeriodIsSelect: number;
    Time: string;
    IsEnabled: boolean;
    SubMenu_ID: string;
    SubMenu_Name: string;
    Category_ID: string;
    Category_Name: string;
    Item_ID: string;
    Item_Name: string;
    Description: string;
    Price: number;
    ImageUrl: string;
    IsAvailable: boolean;
    IsDisable: boolean;
  }