import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';

interface Props {
  total: number;
}
const Pagination = ({total}: Props) => {
  const totalPages = Math.ceil(total / 10);
  return <Text>{totalPages}</Text>;
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
});
