/**
 * Entrada do app (package.json "main").
 * 1) Reanimated deve ser o primeiro import do bundle.
 * 2) Fecha a splash nativa de forma síncrona antes do expo-router montar o React —
 *    em vários builds Android a splash continua por cima até `hide()` nativo.
 */
import 'react-native-reanimated';

try {
  const { hide } = require('expo-splash-screen');
  if (typeof hide === 'function') {
    hide();
  }
} catch {
  /* ignore */
}

require('expo-router/entry');
