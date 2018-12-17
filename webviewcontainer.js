import React, { Component } from 'react';
import { WebView } from 'react-native';

class MyInlineWeb extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://github.com/facebook/react-native'}}
        originWhitelist={['*']}
      />
    );
  }
}

export default MyInlineWeb;