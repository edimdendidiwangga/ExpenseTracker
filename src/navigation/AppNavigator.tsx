import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import UserPopover from '../components/UserPopover';
import LoginScreen from '../screens/LoginScreen';
import ExpenseStatisticsScreen from '../screens/ExpenseStatisticsScreen';
import AddEditExpenseScreen from '../screens/AddEditExpenseScreen';
import ManageExpensesScreen from '../screens/ManageExpensesScreen';
import AllUsersExpensesScreen from '../screens/AllUsersExpensesScreen';
import SvgIcon from '../components/SvgIcon';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="ExpenseStatistics"
      screenOptions={{
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ExpenseStatistics"
        component={ExpenseStatisticsScreen}
        options={{
          tabBarLabel: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <SvgIcon name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddEditExpenseScreen}
        options={({ navigation }) => ({
          tabBarLabel: 'Add Expense',
          tabBarIcon: ({ color, size }) => (
            <SvgIcon name="add" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('AddExpense', { expenseId: undefined })}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ManageExpenses"
        component={ManageExpensesScreen}
        options={{
          tabBarLabel: 'Manage Expenses',
          tabBarIcon: ({ color, size }) => (
            <SvgIcon name="view" color={color} size={size} />
          ),
        }}
      />
      {userRole === 'Admin' && (
        <Tab.Screen
          name="AllUsersExpenses"
          component={AllUsersExpensesScreen}
          options={{
            tabBarLabel: 'All Expenses',
            tabBarIcon: ({ color, size }) => (
              <SvgIcon name="view" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { userToken, userRole, isLoading, signOut } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerRight: () => (
          <UserPopover onLogout={signOut} userRole={userRole} />
        ),
        headerStyle: { backgroundColor: '#1E3A8A' },
        headerTintColor: '#fff',
      })}
    >
      {userToken ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
