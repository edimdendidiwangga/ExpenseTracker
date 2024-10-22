import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface Props {
  chartType: string;
  setChartType: (type: string) => void;
}

const ChartTypeSelector: React.FC<Props> = ({ chartType, setChartType }) => {
  const chartTypes = ['Pie', 'Bar', 'Line'];

  return (
    <View className="flex-row justify-center mb-2">
      {chartTypes.map((type) => (
        <Pressable
          key={type}
          onPress={() => setChartType(type)}
          className={`px-4 py-2 rounded-lg mx-1 ${chartType === type ? 'bg-[#1E3A8A]' : 'bg-[#22C55E]'}`}
        >
          <Text className="text-white font-bold">{type} Chart</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ChartTypeSelector;
