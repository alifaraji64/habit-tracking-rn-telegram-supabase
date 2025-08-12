import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
const _layout = () => {
    const router = useRouter();

    const { signOut } = useAuth();
    return (
        <Tabs>
            <Tabs.Screen
                name='profile'
                options={{
                    headerShown: true,
                    headerRight: () => {
                        return <TouchableOpacity
                            className=' px-2 border-2 mr-4 rounded-lg border-red-400'
                            onPress={async () => {
                                await signOut();
                                router.replace('/(auth)/login')
                            }}
                        >
                            <Text className='text-red-400 p-1'>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='person-circle-outline' size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='telegram'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='paper-plane-outline' size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default _layout