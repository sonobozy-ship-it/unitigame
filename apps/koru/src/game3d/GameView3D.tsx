import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Level } from '../data/levels';
import { GAME_HTML } from './scene';

export interface GameView3DHandle {
  loadLevel: (level: Level) => void;
  resetLevel: () => void;
  hintClear: () => void;
}

interface Props {
  onProgress: (fillPct: number, moves: number) => void;
  onWin: (moves: number) => void;
}

const GameView3D = forwardRef<GameView3DHandle, Props>(({ onProgress, onWin }, ref) => {
  const webRef = useRef<WebView>(null);

  const post = useCallback((data: object) => {
    webRef.current?.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify(data).replace(/'/g, "\\'")}' })); true;`
    );
  }, []);

  useImperativeHandle(ref, () => ({
    loadLevel: (level: Level) => post({ type: 'LOAD_LEVEL', level }),
    resetLevel: () => post({ type: 'RESET' }),
    hintClear:  () => post({ type: 'HINT_CLEAR' }),
  }));

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'PROGRESS') onProgress(msg.fillPct, msg.moves);
      if (msg.type === 'WIN')      onWin(msg.moves);
    } catch {}
  }, [onProgress, onWin]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ html: GAME_HTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        allowFileAccess
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
});

export default GameView3D;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview:   { flex: 1, backgroundColor: '#0A0A14' },
});
