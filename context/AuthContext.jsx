import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    console.log('hh');
                }
                if (error) {
                    console.log(error);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                
            }

        };

        getSession();

        // Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        // Cleanup listener on unmount
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        return data.user;
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data.user;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);

