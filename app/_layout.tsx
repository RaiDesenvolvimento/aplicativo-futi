import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ReservationsProvider } from '@/context/reservations-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReservationsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="arena-detail" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="arena-booking" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="arena-share-payment" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </ReservationsProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
