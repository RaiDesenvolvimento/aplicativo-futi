import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

const splashSource = require('@/assets/animations/ifute-splash.json');

const SPLASH_MAX_MS = 8000;

SplashScreen.preventAutoHideAsync().catch(() => {});

type AnimatedSplashOverlayProps = {
  children: ReactNode;
};

export function AnimatedSplashOverlay({ children }: AnimatedSplashOverlayProps) {
  const scheme = useColorScheme();
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

  const bg = scheme === 'dark' ? '#000000' : '#ffffff';

  return (
    <View style={styles.root}>
      {children}
      {overlayVisible ? (
        <View
          style={[styles.overlay, { backgroundColor: bg }]}
          onLayout={hideNativeWhenLottieReady}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <LottieView
            source={splashSource}
            autoPlay
            loop={false}
            style={styles.lottie}
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
  },
  lottie: {
    width: '72%',
    maxWidth: 360,
    aspectRatio: 1,
  },
});
