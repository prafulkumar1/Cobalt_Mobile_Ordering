import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, Platform } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
 
export const { width, height } = Dimensions.get("window");
 
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
 
const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
 
export { horizontalScale, verticalScale, moderateScale };


export const isPlatformAndroid = () => {
  return Platform.OS == "android"
}

export const isPlatformIos = () => {
  return Platform.OS == "ios"
}

export const isPlatformWeb = () => {
  return Platform.OS == "web"
}

export const setApiUrl = async() => {
  const baseApiUrl = await AsyncStorage.getItem("apiURL")
  if(baseApiUrl !== null){
    return baseApiUrl
  }
}

export const transformStyles = (styles:any) => {
  if (!styles || typeof styles !== "object") return {};

  const applyResponsive = (styleObj:any) => {
    if (!styleObj || typeof styleObj !== "object") return styleObj;

    return Object.keys(styleObj).reduce((acc, key) => {
      const value = styleObj[key];

      if (typeof value === "string") {
        const widthMatch = value.match(/^responsiveWidth\(([\d.]+)\)$/);
        const heightMatch = value.match(/^responsiveHeight\(([\d.]+)\)$/);
        const fontSizeMatch = value.match(/^responsiveFontSize\(([\d.]+)\)$/);

        if (widthMatch) {
          const num = parseFloat(widthMatch[1]); // Extract number from parentheses
          acc[key] = isNaN(num) ? value : responsiveWidth(num);
        } else if (heightMatch) {
          const num = parseFloat(heightMatch[1]); // Extract number from parentheses
          acc[key] = isNaN(num) ? value : responsiveHeight(num);
        } else if (fontSizeMatch) {
          const num = parseFloat(fontSizeMatch[1]); // Extract number from parentheses
          acc[key] = isNaN(num) ? value : responsiveFontSize(num);
        } else {
          acc[key] = value;
        }
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  };

  return Object.fromEntries(
    Object.entries(styles).map(([className, styleObject]) => [className, applyResponsive(styleObject)])
  );
};