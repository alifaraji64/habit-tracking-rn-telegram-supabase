import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../supabase';
const login = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.',);
            return;
        }
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            Alert.alert('Error', error.message);
            return
        }
        Alert.alert('Success', `Welcome back, ${data.user.email}`);
        // Navigate to your authenticated app screen here
        router.replace('/profile')
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
        
    };

    return (
        <View className="p-6 mt-20">
            <Text className="mb-2 font-bold text-lg" style={{ color: theme.text }}>Email</Text>
            <TextInput
                className="border border-gray-400 rounded-md px-4 py-2 mb-6"
                style={{ color: theme.text }}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.text}
                value={email}
                onChangeText={setEmail}
            />

            <Text className="mb-2 font-bold text-lg" style={{ color: theme.text }}>Password</Text>
            <TextInput
                className="border border-gray-400 rounded-md px-4 py-2 mb-6"
                style={{ color: theme.text }}
                placeholder="Enter password"
                secureTextEntry
                placeholderTextColor={theme.text}
                value={password}
                onChangeText={setPassword}
            />
            <View className="mt-4">
                <Button title="Login" onPress={handleLogin} />
            </View>
        </View>
    )
}

export default login

const styles = StyleSheet.create({})