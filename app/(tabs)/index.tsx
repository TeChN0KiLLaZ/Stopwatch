import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Redirect to the Stopwatch screen when the app starts
  return <Redirect href="/(tabs)/Stopwatch" />;
}