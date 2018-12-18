/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
import OneSignal from "react-native-onesignal";
import MyInlineWeb from "./webviewcontainer";

const ONESIGNAL_TOKEN = "a58ca839-9e6a-43a9-8d27-489540407383";
let imageUri =
  "https://cdn-images-1.medium.com/max/300/1*7xHdCFeYfD8zrIivMiQcCQ.png";

export default class RNOneSignal extends Component {
  constructor(properties) {
    super(properties);

    OneSignal.setLogLevel(7, 0); // VERBOSE

    let requiresConsent = false;

    this.state = {
      emailEnabled: false,
      animatingEmailButton: false,
      initialOpenFromPush: "Did NOT open from push",
      activityWidth: 0,
      width: 0,
      activityMargin: 0,
      buttonColor: Platform.OS == "ios" ? "#ffffff" : "#d45653",
      jsonDebugText: "",
      privacyButtonTitle: "Privacy Consent: Not Granted",
      requirePrivacyConsent: requiresConsent
    };

    OneSignal.setRequiresUserPrivacyConsent(requiresConsent);
  }

  async componentDidMount() {}

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);

    this.setState({
      jsonDebugText: "RECEIVED: \n" + JSON.stringify(notification, null, 2)
    });
  }

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);

    this.setState({
      jsonDebugText:
        "OPENED: \n" + JSON.stringify(openResult.notification, null, 2)
    });
  }

  onIds(device) {
    console.log("Device info: ", device);
  }

  handleWebViewMessage = message => {
    console.log("2. Webview saids: ", message);
    const m = JSON.parse(message);
    if (m && m.type === "SUBSCRIBE_PUSH") {
      this.triggerSubscribeNativePush();
    } else {
      console.log("Some other event");
    }
  };

  triggerSubscribeNativePush = async () => {
    console.log("3. register OneSignal begins");
    // Do OneSignal stuff
    await OneSignal.init(ONESIGNAL_TOKEN, { kOSSettingsKeyAutoPrompt: true });
    var providedConsent = await OneSignal.userProvidedPrivacyConsent();
    console.log("providedConsent: ", providedConsent);

    this.setState({
      privacyButtonTitle: `Privacy Consent: ${
        providedConsent ? "Granted" : "Not Granted"
      }`,
      privacyGranted: providedConsent
    });

    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2);

    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);

    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);

    alert("Push subscribed");
  };

  render() {
    return (
      <MyInlineWeb handleWebViewMessage={this.handleWebViewMessage} />
    );
  }
}

const Settings = props => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      <View>
        <Image style={styles.imageStyle} source={{ uri: imageUri }} />
      </View>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>To get started, edit index.js</Text>
      <Text style={styles.instructions}>
        Double tap R on your keyboard to reload,{"\n"}
        Shake or press menu button for dev menu3
      </Text>
      <View style={{ flexDirection: "row", overflow: "hidden" }} />
      <View style={{ flexDirection: "row", overflow: "hidden" }}>
        <ActivityIndicator
          style={{
            width: this.state.activityWidth,
            marginLeft: this.state.activityMargin
          }}
          animating={this.state.animatingEmailButton}
        />
      </View>
      <Text style={styles.jsonDebugLabelText}>{this.state.jsonDebugText}</Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F5FCFF"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    marginHorizontal: 10
  },
  jsonDebugLabelText: {
    textAlign: "left",
    color: "#333333",
    marginBottom: 5,
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: "#d45653"
  },
  button: {
    color: "#000000",
    flex: 1
  },
  imageStyle: {
    height: 200,
    width: 200,
    marginTop: 20
  },
  textInput: {
    marginHorizontal: 10,
    height: 40
  }
});

AppRegistry.registerComponent("RNOneSignal", () => RNOneSignal);
