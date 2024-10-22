import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { 
  getTotalSpendingByRange, 
  getTotalSpendingPerDay, 
  getCategoryBreakdown, 
  getLatestExpenses 
} from '../utils/db';
import TimeRangeSelector from '../components/TimeRangeSelector';
import CategoryFilter from '../components/CategoryFilter';
import ChartTypeSelector from '../components/ChartTypeSelector';
import ExpenseChart from '../components/ExpenseChart';

const Container = styled(View);

const ExpenseStatisticsScreen = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [totalSpending, setTotalSpending] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [chartType, setChartType] = useState('Pie');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openCategoryPicker, setOpenCategoryPicker] = useState(false);
  const [categories] = useState([
    { label: 'All', value: '' },
    { label: 'Food', value: 'Food' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Bills', value: 'Bills' }
  ]);

  useEffect(() => {
    fetchStatistics();
  }, [timeRange, selectedCategory]);

  const fetchStatistics = async () => {
    const { startDate, endDate } = getDateRange(timeRange);

    const total = timeRange === 'daily'
      ? await getTotalSpendingPerDay(endDate)
      : await getTotalSpendingByRange(startDate, endDate);
    setTotalSpending(total);

    const breakdown = await getCategoryBreakdown(selectedCategory);
    setCategoryBreakdown(breakdown.map((item) => ({
      name: item.category,
      population: isFinite(item.total) ? item.total : 0,
      color: getRandomColor(),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    })));
  };

  const getDateRange = (range) => {
    const now = new Date();
    let startDate = '';
    let endDate = now.toISOString().split('T')[0];

    if (range === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek.toISOString().split('T')[0];
    } else if (range === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      startDate = lastMonth.toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <Container className="flex-1 bg-gray-100 p-4">
      <ScrollView
        horizontal={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          openCategoryPicker={openCategoryPicker}
          setOpenCategoryPicker={setOpenCategoryPicker}
        />
        <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
        
        {/* Display Total Spending */}
        <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <Text className="text-xl font-bold text-[#1E3A8A]">Total Spending:</Text>
          <Text className="text-lg font-semibold text-[#22C55E]">${totalSpending.toFixed(2)}</Text>
        </View>

        {/* Display Category Breakdown */}
        <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <Text className="text-xl font-bold text-[#1E3A8A]">Category Breakdown:</Text>
          {categoryBreakdown.map(item => (
            <Text key={item.name} className="text-lg text-gray-700">
              {item.name}: {((item.population / totalSpending) * 100).toFixed(2)}%
            </Text>
          ))}
        </View>

        <ExpenseChart chartType={chartType} data={categoryBreakdown} />
      </ScrollView>
    </Container>
  );
};

export default ExpenseStatisticsScreen;
