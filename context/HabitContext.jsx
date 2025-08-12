import { format } from 'date-fns';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
const HabitContext = createContext()
export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    useEffect(() => {
        const fetchHabits = async () => {
            const { data, error } = await supabase
                .from('habits')
                .select('*')
                .order('created_at', { ascending: true });
            if (error) {
                console.log(error.message);
                Alert.alert('Error', error.message);
            } else {
                console.log('Fetched habits:', data);
                setHabits(data);
            }
        };

        fetchHabits();
    }, []);
    const addHabit = async ({ habitName, pickerDate, habitTime }) => {
        if (!habitName || !habitTime) {
            throw new Error('Please provide habit name, time.');
        }
        const { data, error } = await supabase
            .from('habits') // your table name
            .insert([
                {
                    name: habitName,
                    selected_time: format(pickerDate, 'yyyy-MM-dd hh:mm a'),
                    checked: false,
                }
            ])
            .select();
        if (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
        return data;
    }
    const toggleHabit = async (index, clickSound) => {
        // Play click sound only if loaded
        try {
            if (clickSound.current) {
                const status = await clickSound.current.getStatusAsync();
                if (status.isLoaded) {
                    await clickSound.current.replayAsync();
                }
            }
        } catch (e) {
            console.log('Sound play error', e);
        }
        const habit = habits[index];
        const { data, error } = await supabase.from('habits').update({ checked: !habit.checked }).eq('id', habit.id);
        if (error) {
            console.log(error.message);
            Alert.alert('Error', error.message);
            return;
        }
        const newHabits = [...habits];
        newHabits[index].checked = !newHabits[index].checked;
        setHabits(newHabits);
    };

    const deleteHabit = async (id) => {
        const { error } = await supabase.from('habits').delete().eq('id', id);
        console.log('Deleted habit with id:', id);
        
        if (error) {
            throw new Error(error.message);
        }
        setHabits(habits.filter(habit => habit.id !== id));
    }
    return (
        <HabitContext.Provider value={{ habits, addHabit, setHabits, toggleHabit, deleteHabit }}>{children}</HabitContext.Provider>
    )
}
export const useHabit = () => useContext(HabitContext);