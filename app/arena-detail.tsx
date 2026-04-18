import { ArenaLinkScreen } from '@/components/arena-link-screen';
import { StatusBar } from 'expo-status-bar';

export default function ArenaDetailScreen() {
  return (
    <>
      <StatusBar style="light" />
      <ArenaLinkScreen variant="stack" />
    </>
  );
}
