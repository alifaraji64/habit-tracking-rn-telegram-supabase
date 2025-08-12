import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import HabitForm from '../../components/habit-form';
import HabitItems from '../../components/habit-items';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const clickSound = useRef();
  useEffect(() => {
    // Load click sound
    (async () => {
      clickSound.current = new Audio.Sound();
      try {
        await clickSound.current.loadAsync(require('../../assets/switch.mp3'));
      } catch (e) {
        console.log('Failed to load sound', e);
      }
    })();

    // Optionally clean up sound on unmount
    return () => {
      if (clickSound.current) {
        clickSound.current.unloadAsync();
      }
    };
  }, [])

  useEffect(() => {
    if (user?.email) {
      navigation.setOptions({ title: user.email });
    }
  }, [user?.email, navigation]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Habit Tracker</Text>
      <HabitForm></HabitForm>
      <HabitItems clickSound={clickSound}></HabitItems>
    </View>
  );
}

export default Profile

