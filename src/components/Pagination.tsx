import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

interface Props {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({total, current, onPageChange}: Props) => {
  const totalPages = Math.ceil(total / 10);

  const PageButton = ({page}: {page: number}) => (
    <Button
      title={`${page + 1}`}
      onPress={() => onPageChange(page)}
      color={current === page ? 'blue' : 'red'}
    />
  );

  const renderPages = () => {
    let items = [];
    if (totalPages > 3) {
      if (current > 0) {
        items.push(<PageButton key={0} page={0} />);

        items.push(
          <Text key={`${0}-trail`} style={{color: 'red'}}>
            ...
          </Text>,
        );
      }

      if (current < totalPages - 3) {
        items.push(<PageButton key={current} page={current} />);
        items.push(<PageButton key={current + 1} page={current + 1} />);
        items.push(<PageButton key={current + 2} page={current + 2} />);

        items.push(
          <Text key={`${totalPages}-trail`} style={{color: 'red'}}>
            ...
          </Text>,
        );

        items.push(<PageButton key={totalPages - 1} page={totalPages - 1} />);
      } else {
        items.push(<PageButton key={totalPages - 3} page={totalPages - 3} />);
        items.push(<PageButton key={totalPages - 2} page={totalPages - 2} />);
        items.push(<PageButton key={totalPages - 1} page={totalPages - 1} />);
      }
    } else {
      for (let i = 0; i < totalPages; i++) {
        items.push(<PageButton key={i} page={i} />);
      }
    }

    return items;
  };

  return (
    <View style={styles.container}>
      <Button
        title={'◀'}
        accessibilityLabel={'arrow-left'}
        disabled={current === 0}
        onPress={() => onPageChange(current - 1)}
        color={'red'}
      />
      {renderPages()}
      <Button
        title={'▶'}
        accessibilityLabel={'arrow-right'}
        disabled={current === totalPages - 1}
        onPress={() => onPageChange(current + 1)}
        color={'red'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Pagination;
