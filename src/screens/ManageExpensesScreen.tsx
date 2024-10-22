import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { styled } from 'nativewind';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { getExpenses, deleteExpense } from '../utils/db';
import ExpenseIcons from '../components/ExpenseIcons';

const Container = styled(View);
const Title = styled(Text);
const ExpenseCard = styled(Card);

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const ManageExpensesScreen: React.FC = () => {
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

  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses();
    }, [])
  );

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
            fetchExpenses();
          },
        },
      ]
    );
  };

  const handleEditExpense = (id: number) => {
    navigation.navigate('AddExpense', {
      expenseId: id,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseCard className="m-2 rounded-lg shadow-md bg-white p-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-semibold text-[#1E3A8A]">{item.category}</Text>
          <Text className="text-sm text-gray-500">{item.date}</Text>
        </View>
        <Text className="text-lg font-bold text-[#22C55E]">${item.amount}</Text>
          <ExpenseIcons onEdit={() => handleEditExpense(item.id)} onDelete={() => handleDeleteExpense(item.id)} />
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </Container>
  );
};

export default ManageExpensesScreen;
