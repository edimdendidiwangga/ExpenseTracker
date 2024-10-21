import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { styled } from 'nativewind';
import { insertExpense, updateExpense, getExpenseById } from '../utils/db';
import { getExchangeRate } from '../services/exchangeRateApi'; // Import the function to get exchange rates
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../utils/colors'; // Assuming you have a constants file for colors

const Container = styled(View);
const Title = styled(Text);

const AddEditExpenseScreen = ({ route, navigation }) => {
  const { expenseId } = route.params || {};

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [targetCurrency, setTargetCurrency] = useState('EUR'); // Default EUR
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

  const fetchExpense = async (id) => {
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

    const expenseData = { category, amount: parseFloat(amount), date: date.toISOString().split('T')[0] };

    try {
      if (expenseId) {
        await updateExpense(expenseId, expenseData.category, expenseData.amount, expenseData.date);
        Alert.alert('Success', 'Expense updated successfully!');
      } else {
        await insertExpense(expenseData.category, expenseData.amount, expenseData.date);
        Alert.alert('Success', 'Expense added successfully!');
      }

      navigation.navigate('ManageExpenses', { isRefresh: true });
      resetState(); // Reset fields after saving
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
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

    const rate = await getExchangeRate('USD', targetCurrency);
    if (rate) {
      const converted = parseFloat(amount) * rate;
      setConvertedAmount(converted);
      Alert.alert('Conversion Successful', `Converted Amount: ${targetCurrency} ${converted.toFixed(2)}`);
    } else {
      Alert.alert('Error', 'Failed to fetch exchange rate.');
    }
  };

  return (
    <Container className="flex-1 justify-center items-center bg-white p-6">
      <Title className="text-2xl font-bold mb-6" style={{ color: COLORS.PRIMARY }}>
        {expenseId ? 'Edit Expense' : 'Add New Expense'}
      </Title>

      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        placeholder="Select a category"
        style={{ marginBottom: 16, borderColor: COLORS.PRIMARY }}
        containerStyle={{ width: '75%' }}
        dropDownStyle={{ backgroundColor: COLORS.BACKGROUND }}
      />

      <TextInput
        label="Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={{ marginBottom: 16, width: '75%' }}
        theme={{ colors: { primary: COLORS.PRIMARY } }}
      />

      <TextInput
        label="Date"
        value={date.toISOString().split('T')[0]}
        mode="outlined"
        onFocus={() => setShowDatePicker(true)}
        style={{ marginBottom: 16, width: '75%' }}
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

      <Button
        mode="contained"
        onPress={handleSaveExpense}
        style={{ backgroundColor: COLORS.PRIMARY, width: '75%', paddingVertical: 8 }}
      >
        {expenseId ? 'Update Expense' : 'Add Expense'}
      </Button>

      <Button
        mode="contained"
        onPress={handleConvertCurrency}
        style={{ backgroundColor: '#22C55E', width: '75%', paddingVertical: 8, marginTop: 16 }}
      >
        Convert Currency
      </Button>

      {convertedAmount !== null && (
        <Text className="text-lg text-gray-600 mb-4">
          Converted Amount: {targetCurrency} {convertedAmount.toFixed(2)}
        </Text>
      )}
    </Container>
  );
};

export default AddEditExpenseScreen;
