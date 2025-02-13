import React, { useEffect } from 'react';
import { View, Switch, Text } from 'react-native';
import { Slot } from 'expo-router';
import { useQuizStore } from '../store';
import { layoutLightStyles, layoutDarkStyles } from './styles';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  const { theme, loadTheme, toggleTheme } = useQuizStore();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    loadTheme(); // Load stored theme on app start
  }, []);

  const styles = isDarkMode ? layoutDarkStyles : layoutLightStyles;

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <View style={styles.switchContainer}>
        <Text style={styles.text}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
      <Slot />
    </View>
  );
}