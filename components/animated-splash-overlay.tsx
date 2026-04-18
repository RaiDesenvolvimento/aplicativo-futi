import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

const splashSource = require('@/assets/animations/ifute-splash.json');

const SPLASH_MAX_MS = 8000;

SplashScreen.preventAutoHideAsync().catch(() => {});

type AnimatedSplashOverlayProps = {
  children: ReactNode;
};

export function AnimatedSplashOverlay({ children }: AnimatedSplashOverlayProps) {
  const { width: windowW, height: windowH } = useWindowDimensions();
  const [overlayVisible, setOverlayVisible] = useState(true);
  const nativeHiddenRef = useRef(false);

  const finish = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  useEffect(() => {
    const id = setTimeout(finish, SPLASH_MAX_MS);
    return () => clearTimeout(id);
  }, [finish]);

  const hideNativeWhenLottieReady = useCallback(async () => {
    if (nativeHiddenRef.current) return;
    nativeHiddenRef.current = true;
    await SplashScreen.hideAsync();
  }, []);

  const lottieSize = Math.min(windowW, windowH) * 0.92;

  return (
    <View style={styles.root}>
      {children}
      {overlayVisible ? (
        <View
          style={styles.overlay}
          onLayout={hideNativeWhenLottieReady}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <LottieView
            source={splashSource}
            autoPlay
            loop={false}
            style={{ width: lottieSize, height: lottieSize }}
            onAnimationFinish={finish}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
