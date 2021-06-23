import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import Pagination from '../src/Pagination';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

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

  test('calls onPageChange on page tap with correct value', () => {
    const tapSpy = jest.fn();
    const {getByText} = render(
      <Pagination current={1} total={100} onPageChange={tapSpy} />,
    );

    fireEvent.press(getByText('10'));
    expect(tapSpy).toHaveBeenCalledTimes(1);
    expect(tapSpy).toHaveBeenCalledWith(10);

    fireEvent.press(getByText('3'));
    expect(tapSpy).toHaveBeenCalledTimes(2);
    expect(tapSpy).toHaveBeenCalledWith(3);
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
