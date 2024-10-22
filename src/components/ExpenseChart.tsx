import React from 'react';
import { Text, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Props {
  chartType: string;
  data: any[];
}

const ExpenseChart: React.FC<Props> = ({ chartType, data }) => {
  if (data.length === 0) {
    return (
      <Text style={{ color: '#888', marginTop: 20, textAlign: 'center' }}>
        No data available for the selected time range.
      </Text>
    );
  }

  const chartConfig = {
    backgroundColor: '#F3F4F6',
    backgroundGradientFrom: '#1E3A8A',
    backgroundGradientTo: '#22C55E',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  switch (chartType) {
    case 'Pie':
      return (
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      );
    case 'Bar':
    case 'Category':
      return (
        <BarChart
          data={{
            labels: data.map((item) => item.name),
            datasets: [{ data: data.map((item) => item.population) }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
        />
      );
    case 'Line':
      return (
        <LineChart
          data={{
            labels: data.map((item) => item.name),
            datasets: [{ data: data.map((item) => item.population) }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      );
    default:
      return null;
  }
};

export default ExpenseChart;
