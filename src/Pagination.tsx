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
    for (let i = 0; i < totalPages; i++) {
      if (i === 4) {
        items.push(
          <Text key={'...'} style={{color: 'red'}}>
            ...
          </Text>,
        );
      } else {
        if (i < 4 || i === totalPages - 1) {
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
