import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';

interface Props {
  total: number;
}
const Pagination = ({total}: Props) => {
  return <Text>{total / 10}</Text>;
};

describe('Pagination.tsx', () => {
  test('displays one page when total is 10', () => {
    const {getByText} = render(<Pagination total={10} />);

    expect(getByText('1')).not.toBeNull();
  });
});
