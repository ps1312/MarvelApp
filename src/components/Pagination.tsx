import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import theme from '../theme';

interface Props {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({total, current, onPageChange}: Props) => {
  const totalPages = Math.ceil(total / 10);

  const PageButton = ({page}: {page: number}) => {
    const selected = current === page;
    return (
      <TouchableOpacity
        onPress={() => onPageChange(page)}
        style={[
          selected
            ? styles.pageItemContainerSelected
            : styles.pageItemContainer,
        ]}>
        <Text
          style={
            selected ? styles.pageItemTextSelected : styles.pageItemText
          }>{`${page + 1}`}</Text>
      </TouchableOpacity>
    );
  };

  const renderPages = () => {
    let items = [];
    if (totalPages > 3) {
      if (current > 0) {
        items.push(<PageButton key={0} page={0} />);

        items.push(
          <Text key={`${0}-trail`} style={styles.pageItemText}>
            ...
          </Text>,
        );
      }

      if (current < totalPages - 3) {
        items.push(<PageButton key={current} page={current} />);
        items.push(<PageButton key={current + 1} page={current + 1} />);
        items.push(<PageButton key={current + 2} page={current + 2} />);

        items.push(
          <Text key={`${totalPages}-trail`} style={styles.pageItemText}>
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
      <TouchableOpacity
        accessibilityLabel={'arrow-left'}
        disabled={current === 0}
        onPress={() => onPageChange(current - 1)}
        style={styles.arrowItemContainer}>
        <Text style={styles.arrowItemText}>{'<'}</Text>
      </TouchableOpacity>
      {renderPages()}
      <TouchableOpacity
        accessibilityLabel={'arrow-right'}
        disabled={current === totalPages - 1}
        onPress={() => onPageChange(current + 1)}
        style={styles.arrowItemContainer}>
        <Text style={styles.arrowItemText}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  arrowItemContainer: {
    justifyContent: 'center',
  },
  arrowItemText: {
    marginHorizontal: 18,
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  pageItemContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    marginHorizontal: 4,
  },
  pageItemContainerSelected: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.primaryColor,
    marginHorizontal: 4,
    backgroundColor: theme.primaryColor,
  },
  pageItemText: {
    fontSize: 18,
    color: theme.primaryColor,
  },
  pageItemTextSelected: {
    fontSize: 18,
    color: 'white',
  },
});

export default Pagination;
