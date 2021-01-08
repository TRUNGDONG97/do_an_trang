import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  BackHandler
} from "react-native";
import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";

import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "@theme";
import { SCREEN_ROUTER, TYPE_LOGIN } from "@constant";
import Icon from "@component/Icon";
import { Block, LoadingProgressBar, Button, FastImage } from "@component";
import { connect } from "react-redux";
import R from "@R";
import { showMessages } from "@app/utils/Alert";
import OneSignal from "react-native-onesignal";
import { requestLogin } from "@api";
import Toast, { BACKGROUND_TOAST } from "@app/utils/Toast";
import reactotron from "reactotron-react-native";
export class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    username: "",
    password: "",
    deviceID: "",
    isLoading: false,
    error: null,
    data: {}
  };

  componentDidMount() {
    OneSignal.getPermissionSubscriptionState(async status => {
      this.setState({
        deviceID: status.userId
      });
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  handleBackPress = () => {
    return true;
  };
  login = async () => {
    if (
      this.state.username.trim().length == 0 ||
      this.state.password.trim().length == 0
    ) {
      message = "Mời bạn cập nhật đầy đủ thông tin";
      showMessages(R.strings.notification, message);
      return;
    }
    this.setState({ ...this.state, isLoading: true });
    try {
      const response = await requestLogin({
        user: this.state.username,
        password: this.state.password,
        deviceID: this.state.deviceID
      });
      // reactotron.log(response)
      this.setState({
        ...this.state,
        error: null,
        isLoading: false,
        data: response.data
      });
      reactotron.log("response.data.position", response.data.position);
      reactotron.log("response.data.position", response.data.token);
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem(
        "typeLogin",
        response.data.position == 1 ? TYPE_LOGIN.LEADER : TYPE_LOGIN.EMPLOYEE
      );
      this.props.navigation.navigate(SCREEN_ROUTER.MAIN, {
        typeLogin:
          response.data.position == 1 ? TYPE_LOGIN.LEADER : TYPE_LOGIN.EMPLOYEE
      });
    } catch (err) {
      reactotron.log(err);
      this.setState({
        ...this.state,
        error: null,
        isLoading: false,
        data: null
      });
      if (err.message == "Network Error") {
        Toast.show(I18n.t("network_err"), BACKGROUND_TOAST.FAIL);
      }
      //showMessages(I18n.t("notification"),I18n.t("error") );
      Toast.show("Vui lòng thử lại", BACKGROUND_TOAST.FAIL);
      this.setState({ ...this.state, error: err, isLoading: false });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {this.state.isLoading && <LoadingProgressBar />}
        <FastImage
          style={styles.img}
          resizeMode="contain"
          source={R.images.logo}
        />
        <TextInput
          onSubmitEditing={() => {
            this.passwordInput.focus();
          }}
          value={this.state.username}
          onChangeText={text => this.setState({ username: text })}
          autoCapitalize="none"
          keyboardType="phone-pad"
          clearButtonMode="while-editing"
          returnKeyType="next"
          placeholder={R.strings.account}
          style={[styles.tvInput, { marginBottom: "7%" }]}
        />
        <TextInput
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
          ref={passwordInput => (this.passwordInput = passwordInput)}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          returnKeyType="done"
          placeholder={R.strings.password}
          style={styles.tvInput}
          onSubmitEditing={this.login}
        />
        {/* <TouchableOpacity style={{ width: "85%" }}>
          <Text style={[theme.fonts.bold15, styles.textForgotPassword]}>
            {R.strings.forgot_password}
          </Text>
        </TouchableOpacity> */}
        <Button
          style={{ marginTop: 40 }}
          title={R.strings.login}
          onPress={this.login}
        />
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  img: {
    width: width / 1.5,
    height: 200,
    marginTop: height / 10
  },
  tvInput: {
    paddingLeft: "5%",
    height: 43,
    width: "85%",
    borderColor: "#07c9e7",
    borderWidth: 0.9,
    borderRadius: 3
  },
  textForgotPassword: {
    marginTop: 10,
    textAlign: "right"
  },
  textLogin: {
    color: "white",
    fontSize: 16
  },
  bgButton: {
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  }
});
