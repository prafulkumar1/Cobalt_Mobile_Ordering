
// https://cobaltportal.mycobaltsoftware.com/cssi.cobalt.member.wrapper.CobaltDev/api/  ---->>> BA Dev
// https://cobaltportal.mycobaltsoftware.com/MemberAppService.Wrapper.CobaltTest/API/  ------->>>>>> Testing

import { isPlatformAndroid, setApiUrl } from "../constants/Matrices";

// https://cobaltportal.mycobaltsoftware.com/cssi.cobalt.member.wrapper.EngDev/api/   ---------->>> Dev url
// export const baseURL = isPlatformAndroid()?"https://cobaltportal.mycobaltsoftware.com/cssi.cobalt.member.wrapper.EngDev/api/":global.apiURL;
export const baseURL = ""

export const endpoints = {
    AUTHENTICATE_USER:{
        AUTHENTICATE_USER : "Account/AuthenticateUser"
    },
    UI_CONFIGURATIONS:{
        GET_UI_CONFIGURATIONS:"MobileOrdering/MO_GetControlsInfo"
    },
    PROFIT_CENTER: {
        GET_PROFIT_CENTERS: "MobileOrdering/MO_GetProfitCenters"
    },
   DASHBOARD:{
    GET_DASHBOARD:"Member/GetDashboard"
   }
}
