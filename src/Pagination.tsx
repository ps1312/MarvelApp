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
    <Button title={`${page}`} onPress={() => onPageChange(page)} />
  );

  const renderPages = () => {
    let items = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 4) {
        items.push(<Text key={'...'}>...</Text>);
      } else {
        if (i < 4 || i === totalPages) {
          items.push(<PageButton key={i} page={i} />);
        }
      }
    }
    return items;
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Pagination;
