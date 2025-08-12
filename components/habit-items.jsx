import { format } from 'date-fns';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useHabit } from '../context/HabitContext';
const HabitItems = ({ clickSound }) => {
    const { toggleHabit, habits, setHabits, deleteHabit } = useHabit();
    const renderRightActions = (index) => (
        <View className="flex-1 items-end justify-center bg-red-500 p-2 mb-2 rounded">
            <Text className='text-white text-sm font-semibold'>Delete</Text>
        </View>
    );
    return (
        <FlatList
            data={habits}
            keyExtractor={(_, idx) => idx.toString()}
            className='mt-8'
            renderItem={({ item, index }) => (
                <Swipeable key={item.id} renderRightActions={() => renderRightActions(index)} onSwipeableOpen={async () => {
                    console.log(item.id);
                    try {
                        await deleteHabit(item.id);
                    } catch (error) {
                        console.log('Error deleting habit:', error);
                        Alert.alert('Error', error.message);
                    }

                }}>
                    <View className="flex-row items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Switch
                            value={item.checked}
                            onValueChange={() => toggleHabit(index, clickSound)}
                            trackColor={{ false: '#ccc', true: '#34D399' }}
                            thumbColor={item.checked ? '#10B981' : '#f4f3f4'}
                        />
                        <View className="ml-3">
                            <Text className={`text-lg ${item.checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>{item.name}</Text>
                            <Text className="text-xs text-gray-500">
                                {format(new Date(item.selected_time), 'hh:mm a')}
                            </Text>
                        </View>
                    </View>
                </Swipeable>
            )}
        />
    )
}

export default HabitItems

const styles = StyleSheet.create({})