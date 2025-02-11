import React, { useEffect } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import { Slot } from 'expo-router';
import { useQuizStore } from '../store';

export default function Layout() {
  const { theme, loadTheme, toggleTheme } = useQuizStore();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    loadTheme(); // Load stored theme on app start
  }, []);

  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
      <Slot />
    </View>
  );
}

const commonStyles = {
  container: {
    flex: 1,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
};

const lightStyles = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#ffffff',
  },
  text: {
    ...commonStyles.text,
    color: '#000000',
  },
});

const darkStyles = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#121212',
  },
  text: {
    ...commonStyles.text,
    color: '#ffffff',
  },
});
