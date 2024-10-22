import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ExpenseIconsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseIcons: React.FC<ExpenseIconsProps> = ({ onEdit, onDelete }) => {
  return (
    <>
      <Svg width="24" height="24" viewBox="0 0 24 24" onPress={onEdit} className="ml-2">
        <Path
          d="M3 17.25V21h3.75l11.08-11.08-3.75-3.75L3 17.25zm17.71-10.04c.39-.39.39-1.02 0-1.41l-2.54-2.54c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          fill="#3182CE"
        />
      </Svg>

      {/* Icon for Deleting Expense */}
      <Svg width="24" height="24" viewBox="0 0 24 24" onPress={onDelete} className="ml-2">
        <Path
          d="M3 6h18v2H3V6zm2 4h14v12H5V10zm4 1v8h2v-8H9zm4 0v8h2v-8h-2zm3-8h-4l-1-1h-4l-1 1H4v2h16V3z"
          fill="#E53E3E"
        />
      </Svg>
    </>
  );
};

export default ExpenseIcons;
