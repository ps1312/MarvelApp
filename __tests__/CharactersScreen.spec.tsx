import React from 'react';
import {ActivityIndicator} from 'react-native';
import renderer from 'react-test-renderer';

const CharactersScreen = () => {
  return <ActivityIndicator />;
};

describe('CharactersScreen.tsx', () => {
  test('should display a loading indicator on init', () => {
    const testInstance = renderer.create(<CharactersScreen />).root;
    const activityIndicator = testInstance.findByType(ActivityIndicator);
    expect(activityIndicator).not.toBeNull();
  });
});
