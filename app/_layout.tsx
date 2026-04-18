import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-splash-overlay';
import { AuthRedirect } from '@/components/auth-redirect';
import { AuthProvider } from '@/context/auth-context';
import { ReservationsProvider } from '@/context/reservations-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Abrir em login: evita montar MapView na Explore antes do auth (APK sem chave Maps quebrava o cold start). */
export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useLayoutEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ReservationsProvider>
          <AnimatedSplashOverlay>
            <AuthRedirect />
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="arena-detail" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="arena-booking" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="arena-share-payment" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </AnimatedSplashOverlay>
        </ReservationsProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
