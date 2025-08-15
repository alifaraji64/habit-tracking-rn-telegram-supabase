import * as Clipboard from 'expo-clipboard';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
const Telegram = () => {
    const { user } = useAuth();
    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <Text className='text-gray-800 dark:text-gray-300 p-6 mb-8'>you can use telegram to recieve notifications about your upcoming task, just copy this code and send to our BOT in telegram</Text>
            <Text className='text-gray-800 dark:text-white my-8'>{user && user.id}</Text>
            <Button title='copy' onPress={async () => {
                await Clipboard.setStringAsync(user && user.id);
                Alert.alert("Copied!", "ID copied to clipboard.");
            }}></Button>
        </View>
    )
}

export default Telegram

const styles = StyleSheet.create({})