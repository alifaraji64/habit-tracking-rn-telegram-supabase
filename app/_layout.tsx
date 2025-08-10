import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";
import { supabase } from '../supabase';
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider className='flex-1 dark:bg-gray-800'>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false,animation:'none' }} />
          <Stack.Screen name="(dashboard)/profile" options={{
            headerShown: true, title: 'ali@gmail.com', headerRight: () => {
              return <TouchableOpacity
                className=' px-2'
                onPress={async () => { 
                  await supabase.auth.signOut() 
                  router.replace('/(auth)/login')
                }}
              >
                <Text className='text-red-400'>
                  Logout
                </Text>
              </TouchableOpacity>
            }
          }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
