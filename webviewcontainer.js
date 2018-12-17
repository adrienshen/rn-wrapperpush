import React, { Component } from 'react';
import { WebView } from 'react-native';


class MyInlineWeb extends Component {
  render() {
    const uri = "https://facebook.github.io/react-native/docs/getting-started";
    const app = "https://rnw-pn.firebaseapp.com/";
    return (
      <WebView
        source={{ uri: app }}
        originWhitelist={['*']}
        injectedJavaScript="window.MOBILE_ENV = 'REACT_ANDROID'"
        onMessage={(event) => this.props.handleWebViewMessage(event.nativeEvent.data)}
      />
    );
  }
}

export default MyInlineWeb;