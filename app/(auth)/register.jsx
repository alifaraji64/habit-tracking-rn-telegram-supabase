import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const colorScheme = useColorScheme();
    const router = useRouter()
    const theme = Colors[colorScheme] ?? Colors.light;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    const {signUp} = useAuth()

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        // Proceed with registration logic (API call etc.)
        try {
           const user = await signUp(email,password)
            router.replace('/profile')
        } catch (error) {
            setError(error.message)
            Alert.alert('Error', error.message);
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

            <Text className="mb-2 font-bold text-lg" style={{ color: theme.text }}>Confirm Password</Text>
            <TextInput
                className="border border-gray-400 rounded-md px-4 py-2 mb-6"
                style={{ color: theme.text }}
                placeholder="Confirm password"
                secureTextEntry
                placeholderTextColor={theme.text}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <View className="mt-4">
                <Button title="Register" onPress={handleRegister} />
            </View>
        </View>
    );
};

export default Register;
