import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { HabitProvider } from '../context/HabitContext';
import "../global.css";
export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <HabitProvider>
        <AppLayoutInner colorScheme={colorScheme} />
      </HabitProvider>
    </AuthProvider>
  );
}

function AppLayoutInner({ colorScheme }: { colorScheme: string }) {
  const { signOut, user, loading } = useAuth();
  const router = useRouter()
  if (loading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View className="flex-1 items-center justify-center dark:bg-gray-800 bg-white">
          <Text className="text-gray-800 dark:text-white">Loading...</Text>
          <ActivityIndicator size="large" className='text-gray-800 dark:text-white' />
        </View>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider className='flex-1 dark:bg-gray-800'>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            {user ? (
              <Stack.Screen name="(dashboard)" options={{
                animation: 'none',
                headerShown: false
              }}
              />) : (
              <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'none' }} />)}
          </Stack>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}



