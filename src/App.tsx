import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { createUserTableAndSeed, createExpensesTable } from './utils/db';

const App: React.FC = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      await createUserTableAndSeed();
      await createExpensesTable();
    };

    initializeDatabase();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
