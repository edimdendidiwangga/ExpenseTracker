import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StyledComponent } from 'nativewind';
import { loginUser } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';

interface User {
  email: string;
}

interface AuthContextType {
  signIn: (token: string) => void;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { signIn } = useAuth() as AuthContextType;

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password) as User;
      Alert.alert('Login Successful', `Welcome, ${user.email}!`);
      signIn('dummy-auth-token');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <StyledComponent component={View} tw="flex-1 justify-center items-center px-6 bg-background">
      <StyledComponent component={Text} tw="text-3xl font-bold mb-8 text-primary">
        Welcome Back
      </StyledComponent>

      <StyledComponent
        component={TextInput}
        tw="w-full py-3 px-4 rounded-md mb-4 text-base text-black border border-gray-400 focus:border-primary bg-inputBg"
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <StyledComponent
        component={TextInput}
        tw="w-full py-3 px-4 rounded-md mb-4 text-base text-black border border-gray-400 focus:border-primary bg-inputBg"
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <StyledComponent
        component={TouchableOpacity}
        tw="w-full py-3 rounded-md bg-primary"
        onPress={handleLogin}
      >
        <StyledComponent component={Text} tw="text-white font-semibold text-lg text-center">
          Log In
        </StyledComponent>
      </StyledComponent>
    </StyledComponent>
  );
};

export default LoginScreen;
