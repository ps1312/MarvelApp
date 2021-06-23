import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {View, Text, Button} from 'react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

interface Props {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({total, current, onPageChange}: Props) => {
  const totalPages = Math.ceil(total / 10);

  const renderPages = () => {
    let items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 4) {
        items.push(<Text key={'...'}>...</Text>);
      } else {
        if (i < 4 || i === totalPages) {
          items.push(<Text key={i}>{i}</Text>);
        }
      }
    }
    return items;
  };

  return (
    <View>
      <Button
        title={'◀'}
        accessibilityLabel={'arrow-left'}
        disabled={current === 1}
        onPress={() => onPageChange(current - 1)}
      />
      {renderPages()}
      <Button
        title={'▶'}
        accessibilityLabel={'arrow-right'}
        disabled={current === totalPages}
        onPress={() => onPageChange(current + 1)}
      />
    </View>
  );
};

describe('Pagination.tsx', () => {
  test('displays all pages numbers', () => {
    const {getByText, rerender} = render(
      <Pagination onPageChange={_page => {}} current={1} total={30} />,
    );

    expect(getByText('1')).not.toBeNull();
    expect(getByText('2')).not.toBeNull();
    expect(getByText('3')).not.toBeNull();

    rerender(<Pagination onPageChange={_page => {}} current={1} total={5} />);
    expect(getByText('1')).not.toBeNull();
  });

  test('displays trailing pages as ... representation with last page on end', () => {
    const {getByText} = render(
      <Pagination onPageChange={_page => {}} current={1} total={60} />,
    );

    expect(getByText('1')).not.toBeNull();
    expect(getByText('2')).not.toBeNull();
    expect(getByText('3')).not.toBeNull();
    expect(getByText('...')).not.toBeNull();
    expect(getByText('6')).not.toBeNull();
  });

  test('displays prev and next page buttons', () => {
    const {getByText} = render(
      <Pagination onPageChange={_page => {}} current={1} total={10} />,
    );

    expect(getByText('◀')).not.toBeNull();
    expect(getByText('▶')).not.toBeNull();
  });

  test('prev and next buttons are disabled correctly', () => {
    assertButtons({current: 1, total: 10, leftState: true, rightState: true});
    assertButtons({current: 2, total: 30, leftState: false, rightState: false});
    assertButtons({current: 3, total: 30, leftState: false, rightState: true});
  });

  test('calls onPageChange with prev and next button presses', async () => {
    const tapSpy = jest.fn();
    const {getByText, rerender} = render(
      <Pagination current={1} total={20} onPageChange={tapSpy} />,
    );

    fireEvent.press(getByText('▶'));
    expect(tapSpy).toHaveBeenCalledTimes(1);
    expect(tapSpy).toHaveBeenCalledWith(2);

    rerender(<Pagination current={2} total={20} onPageChange={tapSpy} />);
    fireEvent.press(getByText('◀'));
    expect(tapSpy).toHaveBeenCalledTimes(2);
    expect(tapSpy).toHaveBeenCalledWith(1);
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
    <Pagination onPageChange={_page => {}} current={current} total={total} />,
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
