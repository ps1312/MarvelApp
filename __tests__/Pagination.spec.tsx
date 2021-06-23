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

  const renderPages = () => {
    let items = [];
    for (let i = 0; i <= totalPages; i++) {
      items.push(<Text key={i}>{i}</Text>);
    }
    return items;
  };

  return (
    <View>
      <Button
        title={'◀'}
        accessibilityLabel={'arrow-left'}
        disabled={current === 1}
        onPress={() => {}}
      />
      {renderPages()}
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
  test('displays all pages numbers', () => {
    const {getByText, rerender} = render(<Pagination current={1} total={30} />);

    expect(getByText('1')).not.toBeNull();
    expect(getByText('2')).not.toBeNull();
    expect(getByText('3')).not.toBeNull();

    rerender(<Pagination current={1} total={5} />);
    expect(getByText('1')).not.toBeNull();
  });

  test('displays prev and next page buttons', () => {
    const {getByText} = render(<Pagination current={1} total={10} />);

    expect(getByText('◀')).not.toBeNull();
    expect(getByText('▶')).not.toBeNull();
  });

  test('prev and next buttons are disabled correctly', () => {
    assertButtons({current: 1, total: 10, leftState: true, rightState: true});
    assertButtons({current: 2, total: 30, leftState: false, rightState: false});
    assertButtons({current: 3, total: 30, leftState: false, rightState: true});
  });
});

interface AssertButtons {
  current: number;
  total: number;
  leftState: boolean;
  rightState: boolean;
}
const assertButtons = ({
  current,
  total,
  leftState,
  rightState,
}: AssertButtons) => {
  const {getByLabelText} = render(
    <Pagination current={current} total={total} />,
  );

  const leftButton =
    getByLabelText('arrow-left').props.accessibilityState.disabled;
  if (leftState) {
    expect(leftButton).toEqual(leftState);
  } else {
    expect(leftButton).toBeUndefined();
  }

  const rightButton =
    getByLabelText('arrow-right').props.accessibilityState.disabled;
  if (rightState) {
    expect(rightButton).toEqual(rightState);
  } else {
    expect(rightButton).toBeUndefined();
  }
};
