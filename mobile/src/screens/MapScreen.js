import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getToken } from '../api/auth';

export default function MapScreen() {
  const webviewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        console.warn('Token is missing!');
        return;
      }

      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          if (typeof loadPoints === "function") {
            loadPoints("${token}");
          } else {
            console.warn("loadPoints is not defined");
          }
          true;
        `);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'http://192.168.1.64:3000/web/map.html' }}
        javaScriptEnabled
        onLoadEnd={async () => {
          const token = await getToken();
          if (webviewRef.current && token) {
            webviewRef.current.injectJavaScript(`
              if (typeof loadPoints === "function") {
                loadPoints("${token}");
              }
              true;
            `);
          }
        }}
      />
    </View>
  );
}
