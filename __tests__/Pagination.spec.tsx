import {render} from '@testing-library/react-native';
import React from 'react';
import {View, Text, Button} from 'react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

interface Props {
  current: number;
  total: number;
}
const Pagination = ({total, current}: Props) => {
  const totalPages = Math.ceil(total / 10);
  return (
    <View>
      <Button
        title={'◀'}
        accessibilityLabel={'arrow-left'}
        disabled={current === 1}
        onPress={() => {}}
      />
      <Text>{totalPages}</Text>
      <Button
        title={'▶'}
        accessibilityLabel={'arrow-right'}
        disabled={current === totalPages}
        onPress={() => {}}
      />
    </View>
  );
};

describe('Pagination.tsx', () => {
  test('displays number of pages', () => {
    const {getByText, rerender} = render(<Pagination current={1} total={10} />);
    expect(getByText('1')).not.toBeNull();

    rerender(<Pagination current={1} total={20} />);
    expect(getByText('2')).not.toBeNull();

    rerender(<Pagination current={1} total={14} />);
    expect(getByText('2')).not.toBeNull();

    rerender(<Pagination current={1} total={5} />);
    expect(getByText('1')).not.toBeNull();
  });

  test('displays prev and next page buttons', () => {
    const {getByText} = render(<Pagination current={1} total={10} />);

    expect(getByText('◀')).not.toBeNull();
    expect(getByText('▶')).not.toBeNull();
  });

  test('prev and next buttons are disabled correctly', () => {
    const {getByLabelText, rerender} = render(
      <Pagination current={1} total={10} />,
    );

    expect(
      getByLabelText('arrow-left').props.accessibilityState.disabled,
    ).toBeTruthy();

    expect(
      getByLabelText('arrow-right').props.accessibilityState.disabled,
    ).toBeTruthy();

    rerender(<Pagination current={2} total={30} />);

    expect(
      getByLabelText('arrow-left').props.accessibilityState.disabled,
    ).toBeFalsy();

    expect(
      getByLabelText('arrow-right').props.accessibilityState.disabled,
    ).toBeFalsy();

    rerender(<Pagination current={3} total={30} />);

    expect(
      getByLabelText('arrow-left').props.accessibilityState.disabled,
    ).toBeFalsy();

    expect(
      getByLabelText('arrow-right').props.accessibilityState.disabled,
    ).toBeTruthy();
  });
});
