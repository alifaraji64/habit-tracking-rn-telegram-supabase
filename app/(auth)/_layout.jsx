import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from "react-native";
import { Colors } from '../../constants/Colors';
const Layout = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <Tabs screenOptions={{
            tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
            tabBarStyle: { borderTopColor: 'gray', borderTopWidth: 2,margin:0,paddingBottom: -10 },
            tabBarLabelStyle: { marginBottom: 0, paddingBottom: 0 }
        }}>
            <Tabs.Screen name='login' options={{
                title: 'Login',
                headerShown: false,
                tabBarInactiveTintColor: theme.tabIconDefault,
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarIcon: ({ focused }) =>
                    <Ionicons name={'log-in-outline'} size={24} color={focused ? theme.tabIconSelected : theme.tabIconDefault} />
            }} />
            <Tabs.Screen name='register' options={{
                title: "Register",
                headerShown: false,
                tabBarInactiveTintColor: theme.tabIconDefault,
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarIcon: ({ focused }) =>
                    <Ionicons name={'log-in-outline'} size={24} color={focused ? theme.tabIconSelected : theme.tabIconDefault} />
            }} />
        </Tabs>
    )

}

export default Layout