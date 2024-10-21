import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import { getExpenses, deleteExpense } from '../utils/db';
import { styled } from 'nativewind';
import { useNavigation, useRoute } from '@react-navigation/native';

// Styled components with NativeWind
const Container = styled(View);
const Title = styled(Text);
const ExpenseCard = styled(Card);

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const ManageExpensesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExpenses();

    if (route.params?.isRefresh) {
        fetchExpenses();
    }
  }, [route.params]);

  const fetchExpenses = async () => {
    const fetchedExpenses = await getExpenses();
    setExpenses(fetchedExpenses);
  };

  const handleDeleteExpense = (id: number) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(id);
            fetchExpenses(); // Refresh list after deletion
          },
        },
      ]
    );
  };

  const handleEditExpense = (id: number) => {
    navigation.navigate('AddExpense', {
      expenseId: id,
      onSave: fetchExpenses,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses(); // Refresh data
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseCard
      className="m-2 rounded-lg shadow-md"
      mode="elevated"
      style={{ backgroundColor: '#FFFFFF', padding: 15 }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: '#1E3A8A' }}>{item.category}</Text>
          <Text className="text-sm text-gray-500">{item.date}</Text>
        </View>
        <Text className="text-lg font-bold" style={{ color: '#22C55E' }}>${item.amount}</Text>

        {/* Icon for Editing Expense */}
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          onPress={() => handleEditExpense(item.id)}
          style={{ marginLeft: 10 }}
        >
          <Path
            d="M3 17.25V21h3.75l11.08-11.08-3.75-3.75L3 17.25zm17.71-10.04c.39-.39.39-1.02 0-1.41l-2.54-2.54c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill="#3182CE"
          />
        </Svg>

        {/* Icon for Deleting Expense */}
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          onPress={() => handleDeleteExpense(item.id)}
          style={{ marginLeft: 10 }}
        >
          <Path
            d="M3 6h18v2H3V6zm2 4h14v12H5V10zm4 1v8h2v-8H9zm4 0v8h2v-8h-2zm3-8h-4l-1-1h-4l-1 1H4v2h16V3z"
            fill="#E53E3E"
          />
        </Svg>
      </View>
    </ExpenseCard>
  );

  return (
    <Container className="flex-1 bg-gray-100 p-4">
      <Title className="text-2xl font-extrabold text-center mb-4" style={{ color: '#1E3A8A' }}>
        Manage Your Expenses
      </Title>

      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: '#E5E7EB', height: 1 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Container>
  );
};

export default ManageExpensesScreen;
