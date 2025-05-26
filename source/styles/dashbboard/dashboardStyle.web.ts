import { Dimensions,StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    mainContainer: {
      marginTop:50,
    },
    icons:{ width: 40, height: 40 }
  });