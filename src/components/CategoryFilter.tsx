import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: { label: string; value: string }[];
  openCategoryPicker: boolean;
  setOpenCategoryPicker: (open: boolean) => void;
}

const CategoryFilter: React.FC<Props> = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  openCategoryPicker,
  setOpenCategoryPicker,
}) => {
  return (
    <DropDownPicker
      open={openCategoryPicker}
      value={selectedCategory}
      items={categories}
      setOpen={setOpenCategoryPicker}
      setValue={setSelectedCategory}
      placeholder="Select Category"
      containerStyle={{ width: '75%', alignSelf: 'center', marginVertical: 10 }}
    />
  );
};

export default CategoryFilter;
