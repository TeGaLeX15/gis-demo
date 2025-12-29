import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'http://192.168.1.64:8080/map.html' }}
        javaScriptEnabled
      />
    </View>
  );
}
