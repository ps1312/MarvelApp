import {render} from '@testing-library/react-native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

interface Props {
  total: number;
}
const Pagination = ({total}: Props) => {
  const totalPages = Math.ceil(total / 10);
  return (
    <View>
      <TouchableOpacity>
        <Text>◀</Text>
      </TouchableOpacity>
      <Text>{totalPages}</Text>
      <TouchableOpacity>
        <Text>▶</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Pagination.tsx', () => {
  test('displays number of pages', () => {
    const {getByText, rerender} = render(<Pagination total={10} />);
    expect(getByText('1')).not.toBeNull();

    rerender(<Pagination total={20} />);
    expect(getByText('2')).not.toBeNull();

    rerender(<Pagination total={14} />);
    expect(getByText('2')).not.toBeNull();

    rerender(<Pagination total={5} />);
    expect(getByText('1')).not.toBeNull();
  });

  test('displays prev and next page buttons', () => {
    const {getByText} = render(<Pagination total={10} />);

    expect(getByText('◀')).not.toBeNull();
    expect(getByText('▶')).not.toBeNull();
  });
});
