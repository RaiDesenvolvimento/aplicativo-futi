import { useAuth } from '@/context/auth-context';
import { useRootNavigationState, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';

export function AuthRedirect() {
  const { session, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!ready || !navState?.key) return;
    const isLogin = pathname === '/login';
    if (!session && !isLogin) {
      router.replace('/login');
    } else if (session && isLogin) {
      router.replace('/(tabs)');
    }
  }, [ready, session, pathname, router, navState?.key]);

  return null;
}
