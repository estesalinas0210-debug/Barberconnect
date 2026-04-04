import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeFirestore = firestore()
          .collection('users')
          .doc(user.uid)
          .onSnapshot((doc) => {
            if (doc.exists) {
              setUserData(doc.data());
            }
          });

        return unsubscribeFirestore;
      } else {
        setUserData(null);
      }
    });

    return unsubscribeAuth;
  }, []);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};