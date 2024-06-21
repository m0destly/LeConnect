import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ( { children } ) => {
    const [user, setUser] = useState(null);
     useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        loadUserData();
     }, []);
     
     const saveUser = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
     };

     const clearUser = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
     }

     return (
        <UserContext.Provider value={{ user, saveUser}}>
            {children}
        </UserContext.Provider>
     );
};

export default UserContext;