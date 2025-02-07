// app/index.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import questionsData from './data/questions.json';
import { useQuizStore } from '../store';

export default function HomeScreen() {
  const router = useRouter();
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

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
    let questions = questionsData;
    if (questions.length > 35) {
      questions = shuffleArray(questions).slice(0, 35);
    }
    resetQuiz(); // Reset the store before starting.
    setQuestions(questions);
    router.push('/quiz');
  };

  return (
    <View style={styles.container}>
      <Button title="Start Quiz" onPress={startQuiz} />
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
