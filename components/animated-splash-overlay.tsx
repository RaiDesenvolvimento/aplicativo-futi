import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type AnimatedSplashOverlayProps = {
  children: ReactNode;
};

/** Contêiner raiz (flex). Não chamar `preventAutoHideAsync` aqui — evita splash presa no dev client/APK. */
export function AnimatedSplashOverlay({ children }: AnimatedSplashOverlayProps) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
