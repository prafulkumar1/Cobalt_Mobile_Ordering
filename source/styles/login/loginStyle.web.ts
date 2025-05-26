import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  inputs: {
    borderBottomWidth: 1,
    color: "#fff",
    height: 40,
    width: '100%',
    borderColor: '#fff',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'transparent',
    paddingHorizontal: 5
  },
  iconborder: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
    resizeMode: "contain"
  },
  forgot_passText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "400",
  },
  forgot_passText_web: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "400",
    textAlign: "right"
  },
  login: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginTop: 30,
    borderRadius: 25,
    color: '#0D92F4',
    textAlign: 'center',
    marginHorizontal: "auto",
    width: '70%',
    marginBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  poweredPolicyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: height * 0.018,
    margin: 5,
  },
  webLogo: {
    height: 60,
    width: 210,
    position: 'absolute',
    top: width * 0.05,
  },
  mainImageLogo: { overflow: "hidden", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  subWebContainer: { width: "100%", justifyContent: "center", alignItems: "center" },
  topBox: { width: 600, justifyContent: "center", alignItems: "center" },
  inputContainer: { flexDirection: "row", marginBottom: 20, width: "100%" },
  pwdContainer: { flexDirection: "row", marginBottom: 20, width: "100%" },
  checkBoxWeb: { flexDirection: "row", width: "100%" },
  forgotPwdWeb: { justifyContent: "flex-end", width: "76%", },
  rememberMe: { width: 20, height: 20, borderWidth: 1, borderColor: "#fff", backgroundColor: "#fff" },
  labelCheckBox: { color: '#fff', marginLeft: 10, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: height * 0.02,
    fontWeight: 'bold',
    marginBottom: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B7B7B7',
  },
  inputLabel: {
    fontSize: 18,
    paddingBottom: 10,
  },
  modalInput: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3A6D8C',
  },
  modalButtonText: {
    color: '#3A6D8C',
    fontSize: 16,
    textAlign: 'center',
  },
  lock_img: {
    width: 30,
    height: 40,
    marginBottom: 15,
  },
  cross: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },
  modalContentWeb: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMsgTxt:{ color: 'red', fontSize: 12, marginTop: 2 },
  closeIcon:{ width: 20, height: 20 },
  rememberMeTxtWeb:{ fontSize: 16, marginBottom: 40, textAlign: 'center' }
});