import { Dimensions,StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    subContainer:{paddingHorizontal:10,paddingVertical:10,position:"absolute",bottom:0,flexDirection:"row",justifyContent:"space-between",width:"100%"},
    profileLabel:{
      fontFamily:"SourceSansPro_Bold",
      fontSize:18,
      color:"#fff"
    },
    profileTxt:{
      fontFamily:"SourceSansPro_Regular",
      fontSize:14,
      color:"#fff"
    },
    dateTxt:{
      fontFamily:"SourceSansPro_SemiBold",
      fontSize:14,
      color:"#fff"
    },
    labelTxt:{
      fontFamily:"SourceSansPro_SemiBold",
      fontSize:14,
      color:"#fff"
    },
    statusBar:{ backgroundColor: "#0047AB", width: "100%", height: 30 },
    backLogo:{ height: 280, width: "100%"},
    bellIcon:{ position: "absolute", right: 20, top: 30, width: 25, height: 25 },
    profileImgBtn:{ position:"absolute",bottom:75,marginLeft:10,width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#fff", marginVertical: 15 },
    profileImg:{ width: "100%", height: "100%", borderRadius: 35 },
    viewNewsBtn:{
      borderWidth:1,
      borderRadius:20,
      width:140,
      height:40,
      borderColor:"#0047AB",
      justifyContent:"center",
      alignItems:"center",
    },
    viewNewsTxt:{
      fontFamily:"SourceSansPro_Regular",
      fontSize:20,
      color:"#000"
    },
    newsTxt:{
      fontFamily:"SourceSansPro_Bold",
      fontSize:20,
      color:"#2A4E7D"
    },
    dashboardLabels:{
      fontFamily:"SourceSansPro_Bold",
      fontSize:22,
      color:"#fff",
      textAlign:"center"
    },
    middleContainer:{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 40, paddingRight:15,paddingLeft:5},
    calenderIcon:{ width: 30, height: 30 },
    cardImage:{ width: 148.5, height: 150, justifyContent: "center", alignItems: "center",borderWidth:1,borderColor:"#fff" },
    blackScreen:{ width: "100%", height: "100%", position: "absolute", opacity: 0.3, backgroundColor: "#000" },
    linkBtn:{width:"100%",backgroundColor:"#7BD9F6",padding:8,justifyContent:"center",alignItems:"center",marginVertical:15},
    linkBtnTxt:{
      fontFamily:"SourceSansPro_Regular",
      fontSize:18,
      color:"#fff",
    },
    icons:{ width: 40, height: 40 }
  });