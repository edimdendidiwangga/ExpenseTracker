import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { styled } from 'nativewind';
import { insertExpense, updateExpense, getExpenseById } from '../utils/db';
import { useFocusEffect } from '@react-navigation/native';
import { getExchangeRate } from '../services/exchangeRateApi';
import { COLORS } from '../utils/colors';

const Container = styled(View);
const Title = styled(Text);

type AddEditExpenseScreenProps = {
  route: {
    params: {
      expenseId?: number;
    };
  };
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
};

const AddEditExpenseScreen: React.FC<AddEditExpenseScreenProps> = ({ route, navigation }) => {
  const { expenseId } = route.params || {};
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [items, setItems] = useState([
    { label: 'Food', value: 'Food' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Bills', value: 'Bills' },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (expenseId) {
        fetchExpense(expenseId);
      } else {
        resetState();
      }
    }, [expenseId])
  );

  const resetState = () => {
    setCategory('');
    setAmount('');
    setDate(new Date());
    setConvertedAmount(null);
  };

  const fetchExpense = async (id: number) => {
    try {
      const expense = await getExpenseById(id);
      if (expense) {
        setCategory(expense.category);
        setAmount(expense.amount.toString());
        setDate(new Date(expense.date));
      } else {
        Alert.alert('Error', 'Expense not found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch expense details.');
    }
  };

  const handleSaveExpense = async () => {
    if (!category || !amount || !date) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const expenseData = {
      category,
      amount: parseFloat(amount),
      date: date.toISOString().split('T')[0],
    };

    try {
      if (expenseId) {
        await updateExpense(expenseId, expenseData.category, expenseData.amount, expenseData.date);
        Alert.alert('Success', 'Expense updated successfully!');
      } else {
        await insertExpense(expenseData.category, expenseData.amount, expenseData.date);
        Alert.alert('Success', 'Expense added successfully!');
      }

      resetState();
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleConvertCurrency = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount first.');
      return;
    }

    try {
      const rate = await getExchangeRate('USD', targetCurrency);
      if (rate) {
        const converted = parseFloat(amount) * rate;
        setConvertedAmount(converted);
        Alert.alert('Conversion Successful', `Converted Amount: ${targetCurrency} ${converted.toFixed(2)}`);
      } else {
        Alert.alert('Error', 'Failed to fetch exchange rate.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch exchange rate.');
    }
  };

  return (
    <Container className="flex-1 justify-center items-center bg-white">
      <Title className="text-2xl font-bold mb-6" style={{ color: COLORS.PRIMARY }}>
        {expenseId ? 'Edit Expense' : 'Add New Expense'}
      </Title>

      <DropDownPicker
        open={categoryOpen}
        value={category}
        items={items}
        setOpen={setCategoryOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select a category"
        className="mb-4 border"
        containerStyle={{ width: '75%' }}
        dropDownContainerStyle={{ backgroundColor: COLORS.BACKGROUND }}
        onClose={() => setCategoryOpen(false)}
      />

      <TextInput
        label="Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        className="mb-4 w-3/4"
        theme={{ colors: { primary: COLORS.PRIMARY } }}
      />

      <TextInput
        label="Date"
        value={date.toISOString().split('T')[0]}
        mode="outlined"
        onFocus={() => setShowDatePicker(true)}
        className="mb-4 w-3/4"
        theme={{ colors: { primary: COLORS.PRIMARY } }}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
          maximumDate={new Date()} // Restrict date to today
        />
      )}

      <DropDownPicker
        open={currencyOpen}
        value={targetCurrency}
        items={[
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' },
          { label: 'JPY', value: 'JPY' },
          { label: 'AUD', value: 'AUD' },
          { label: 'IDR', value: 'IDR' },
        ]}
        setOpen={setCurrencyOpen}
        setValue={setTargetCurrency}
        placeholder="Select target currency"
        className="mb-4 border"
        containerStyle={{ width: '75%' }}
        dropDownContainerStyle={{ backgroundColor: COLORS.BACKGROUND }}
        onClose={() => setCurrencyOpen(false)} // Close on clicking outside
      />

      {convertedAmount !== null && (
        <Text className="text-lg text-gray-600 mb-4">
          Converted Amount: {targetCurrency} {convertedAmount.toFixed(2)}
        </Text>
      )}
      
      <Button
        mode="contained"
        onPress={handleConvertCurrency}
        className="bg-green-500 mb-4 w-3/4"
      >
        Convert to {targetCurrency}
      </Button>

      <Button
        mode="contained"
        onPress={handleSaveExpense}
        className="bg-[#1E3A8A] w-3/4"
      >
        {expenseId ? 'Update Expense' : 'Add Expense'}
      </Button>
    </Container>
  );
};

export default AddEditExpenseScreen;
