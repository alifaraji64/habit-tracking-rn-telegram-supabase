import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useHabit } from '../context/HabitContext';
const HabitForm = () => {
    const { setHabits, addHabit, habits } = useHabit()
    const [habitName, setHabitName] = useState('');
    const [pickerDate, setPickerDate] = useState(new Date());
    const [habitTime, setHabitTime] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const {user} = useAuth();
    const handleAddHabit = async () => {
        try {
            const data = await addHabit({ habitName, pickerDate, habitTime,userId:user.id });
            console.log('Inserted data:', data);
            setHabits([...habits, { name: data[0].name, selected_time: data[0].selected_time, checked: false, id: data[0].id }]);
            setHabitName('');
            setHabitTime('');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message);
            return;
        }

    }
    //this will run when we choose a time and hit ok button
    const onTimeChange = (event, selectedDate) => {
        setShowPicker(false);
        console.log('====================================');
        console.log('Selected date:', format(selectedDate, 'hh:mm a'));
        console.log('====================================');
        if (selectedDate) {
            setPickerDate(selectedDate);
            setHabitTime(format(selectedDate, 'hh:mm a'));
        }
    };

    return (
        <View className="mb-4">
            <TextInput
                className="border rounded px-3 py-2 mb-2 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800"
                placeholder="Enter habit"
                placeholderTextColor="#888"
                value={habitName}
                onChangeText={setHabitName}
            />
            <View className="flex-row mb-2 items-center">
                <TouchableOpacity
                    className="border rounded px-3 py-2 mr-2 flex-1 bg-gray-100 dark:bg-gray-800"
                    onPress={() => setShowPicker(true)}
                >
                    <Text className="text-gray-800 dark:text-white">
                        {habitTime ? habitTime : 'Select Time'}
                    </Text>
                </TouchableOpacity>
                {showPicker && (
                    <DateTimePicker
                        value={pickerDate}
                        mode="time"
                        is24Hour={false}
                        display="inline"
                        onChange={onTimeChange}
                    />
                )}
            </View>
            <TouchableOpacity
                className="bg-blue-500 rounded px-4 py-2"
                onPress={handleAddHabit}
            >
                <Text className="text-white text-center font-semibold">Add Habit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HabitForm

const styles = StyleSheet.create({})