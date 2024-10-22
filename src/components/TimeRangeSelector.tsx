import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface Props {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const TimeRangeSelector: React.FC<Props> = ({ timeRange, setTimeRange }) => {
  const ranges = ['daily', 'weekly', 'monthly'];

  return (
    <View className="flex-row justify-center mb-2">
      {ranges.map((range) => (
        <Pressable
          key={range}
          onPress={() => setTimeRange(range)}
          className={`px-4 py-2 rounded-lg mx-2 ${timeRange === range ? 'bg-[#1E3A8A]' : 'bg-[#22C55E]'}`}
        >
          <Text className="text-white font-bold">
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default TimeRangeSelector;
