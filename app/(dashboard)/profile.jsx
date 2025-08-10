
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useState } from 'react';
import { FlatList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const [habitName, setHabitName] = useState('');
  const [habitTime, setHabitTime] = useState('');
  const [habitPeriod, setHabitPeriod] = useState('AM');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [habits, setHabits] = useState([]);

  const addHabit = () => {
    if (habitName && habitTime) {
      const time = habitTime + ' ' + habitPeriod;
      setHabits([...habits, { name: habitName, time, checked: false }]);
      setHabitName('');
      setHabitTime('');
      setHabitPeriod('AM');
    }
  };

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setPickerDate(selectedDate);
      setHabitTime(format(selectedDate, 'hh:mm'));
      setHabitPeriod(format(selectedDate, 'a'));
    }
  };

  const toggleHabit = (index) => {
    const newHabits = [...habits];
    newHabits[index].checked = !newHabits[index].checked;
    setHabits(newHabits);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Habit Tracker</Text>
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
              {habitTime ? `${habitTime} ${habitPeriod}` : 'Select Time'}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={pickerDate}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={onTimeChange}
            />
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-500 rounded px-4 py-2"
          onPress={addHabit}
        >
          <Text className="text-white text-center font-semibold">Add Habit</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={habits}
        keyExtractor={(_, idx) => idx.toString()}
        className='mt-8'
        renderItem={({ item, index }) => (
          <View className="flex-row items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <Switch
              value={item.checked}
              onValueChange={() => toggleHabit(index)}
              trackColor={{ false: '#ccc', true: '#34D399' }}
              thumbColor={item.checked ? '#10B981' : '#f4f3f4'}
            />
            <View className="ml-3">
              <Text className={`text-lg ${item.checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>{item.name}</Text>
              <Text className="text-xs text-gray-500">{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default Profile

