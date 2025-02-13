// app/index.js
import React, { useEffect } from 'react';
import { View, Button, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import questionsData from './data/questions.json';
import { useQuizStore } from '../store';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const systemTheme = useColorScheme();
  const { theme, setTheme, loadTheme } = useQuizStore();

  useEffect(() => {
    loadTheme(); // Load stored theme
  }, []);

  useEffect(() => {
    if (!theme) {
      setTheme(systemTheme); // Set the theme based on system preference
    }
  }, [systemTheme]);

  // Fisher‑Yates shuffle
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startQuiz = () => {
    let questions = shuffleArray(questionsData);

    // Separate questions into 1-point and 2-point questions
    const onePointQuestions = questions.filter(q => q.points === 1);
    const twoPointQuestions = questions.filter(q => q.points === 2);

    if (twoPointQuestions.length < 3 || onePointQuestions.length < 32) {
      console.error("Not enough questions available to satisfy constraints.");
      return;
    }

    // Select exactly 3 two-point questions
    const selectedTwoPointQuestions = shuffleArray(twoPointQuestions).slice(0, 3);

    // Select 32 one-point questions
    const selectedOnePointQuestions = shuffleArray(onePointQuestions).slice(0, 32);

    // Combine selections
    const finalQuestions = [...selectedTwoPointQuestions, ...selectedOnePointQuestions];

    // Validate the total sum
    const totalPoints = finalQuestions.reduce((sum, q) => sum + q.points, 0);
    if (totalPoints !== 38) {
      console.error("Error: Selected questions do not sum up to 38 points.");
      return;
    }

    resetQuiz(); // Reset the store before starting.
    setQuestions(finalQuestions);
    router.push('/quiz');
  };

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      <Button title="Iniciar Test" onPress={startQuiz} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
