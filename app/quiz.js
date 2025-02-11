// app/quiz.js
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store';

export default function QuizScreen() {
  const router = useRouter();
  const {
    questions,
    userAnswers,
    timer,
    quizFinished,
    answerQuestion,
    finishQuiz,
    decrementTimer,
    resetQuiz,
    theme,
  } = useQuizStore();

  const isDarkMode = theme === 'dark';
  const styles = isDarkMode ? darkStyles : lightStyles;

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer();
      const currentTimer = useQuizStore.getState().timer;
      if (currentTimer <= 0) {
        clearInterval(interval);
        Alert.alert(
          "Time's Up!",
          '45 minutes are over, but you can continue your quiz.'
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [decrementTimer]);

  // Memoized answer selection handler
  const onSelectAnswer = useCallback(
    (questionId, choiceId, type) => {
      if (quizFinished) return;
      const current = userAnswers[questionId] || [];
      if (type === 'single') {
        answerQuestion(questionId, [choiceId]);
      } else if (type === 'multiple') {
        const newSelection = current.includes(choiceId)
          ? current.filter((item) => item !== choiceId)
          : [...current, choiceId];
        answerQuestion(questionId, newSelection);
      }
    },
    [answerQuestion, quizFinished, userAnswers]
  );

  // Memoized finish quiz handler
  const onFinishQuiz = useCallback(() => {
    finishQuiz();

    let userScore = 0;
    let correctCount = 0;
    let totalPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id] || [];
      const correctAnswers = question.correctAnswers;
      if (
        userAnswer.length === correctAnswers.length &&
        userAnswer.every((ans) => correctAnswers.includes(ans))
      ) {
        userScore += question.points;
        correctCount += 1;
      }
    });

    const percentage = ((correctCount / questions.length) * 100).toFixed(2);
    const passed = userScore >= 33;
    Alert.alert(
      'Quiz Completed',
      `Your score: ${userScore}/${totalPoints}\n` +
        `You ${passed ? 'passed' : 'failed'} the quiz.\n` +
        `Correct answers: ${percentage}%`
    );
  }, [finishQuiz, questions, userAnswers]);

  // Memoized reset handler
  const onResetQuiz = useCallback(() => {
    resetQuiz();
    router.push('/');
  }, [resetQuiz, router]);

  // Format seconds into MM:SS.
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Image map (manually maintained)
  const imageMap = {
    '21': require('./data/21.jpg'),
    '66': require('./data/66.jpg'),
    '70': require('./data/70.jpg'),
    '72': require('./data/72.jpg'),
    '76': require('./data/76.jpg'),
    '77': require('./data/77.jpg'),
    '78': require('./data/78.jpg'),
    '79': require('./data/79.jpg'),
    '80': require('./data/80.jpg'),
    '81': require('./data/81.jpg'),
    '82': require('./data/82.jpg'),
    '83': require('./data/83.jpg'),
    '98': require('./data/98.jpg'),
    '99': require('./data/99.jpg'),
    '100': require('./data/100.jpg'),
    '102': require('./data/102.jpg'),
    '106': require('./data/106.jpg'),
    '113': require('./data/113.jpg'),
    '114': require('./data/114.jpg'),
  };

  const getImage = (filename) => imageMap[filename] || null;

  // Render each question card
  const renderQuestion = useCallback(
    ({ item: question, index }) => (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          {index + 1}. {question.question} ({question.points} pts)
        </Text>
        {question.image ? (
          <Image
            source={getImage(question.image.split('.')[0])}
            style={styles.questionImage}
          />
        ) : null}
        {question.choices.map((choice) => {
          const selected =
            userAnswers[question.id] &&
            userAnswers[question.id].includes(choice.id);
          const isCorrect = question.correctAnswers.includes(choice.id);
          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                !quizFinished && selected && styles.selectedChoice,
                quizFinished && isCorrect && styles.correctChoice,
                quizFinished && selected && !isCorrect && styles.incorrectChoice,
              ]}
              onPress={() =>
                onSelectAnswer(question.id, choice.id, question.type)
              }
              disabled={quizFinished}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ),
    [onSelectAnswer, quizFinished, userAnswers, styles]
  );

  return (
    <View style={styles.quizContainer}>
      {/* Top Bar: Timer and Progress */}
      <View style={styles.topBar}>
        <Text style={styles.timerText}>Time Remaining: {formatTime(timer)}</Text>
        <Text style={styles.progressText}>
          Answered: {Object.keys(userAnswers).length} / {questions.length}
        </Text>
      </View>

      {/* Questions List using FlatList */}
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(question) => question.id.toString()}
        contentContainerStyle={styles.questionsContainer}
      />

      {/* Bottom Bar: Finish and Reset buttons */}
      <View style={styles.bottomBar}>
        <Button
          title="Finish Quiz"
          onPress={onFinishQuiz}
          disabled={quizFinished}
        />
        <Button title="Reset Quiz" onPress={onResetQuiz} />
      </View>
    </View>
  );
}

// Light Mode Styles
const lightStyles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  timerText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  progressText: { fontSize: 16, color: '#000' },
  questionsContainer: { paddingBottom: 20 },
  questionCard: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  questionText: { fontSize: 16, marginBottom: 5, color: '#000' },
  // Added questionImage style for images (adjust as needed)
  questionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  choiceButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedChoice: { backgroundColor: '#ddd' },
  correctChoice: { backgroundColor: '#8f8' },
  incorrectChoice: { backgroundColor: '#f88' },
  choiceText: { fontSize: 14, color: '#000' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});

// Dark Mode Styles
const darkStyles = StyleSheet.create({
  ...lightStyles,
  quizContainer: { ...lightStyles.quizContainer, backgroundColor: '#121212' },
  topBar: { ...lightStyles.topBar, backgroundColor: '#333' },
  timerText: { ...lightStyles.timerText, color: '#fff' },
  progressText: { ...lightStyles.progressText, color: '#fff' },
  questionCard: { ...lightStyles.questionCard, backgroundColor: '#222', borderColor: '#444' },
  questionText: { ...lightStyles.questionText, color: '#fff' },
  choiceButton: { ...lightStyles.choiceButton, borderColor: '#666' },
  choiceText: { ...lightStyles.choiceText, color: '#fff' },
  selectedChoice: { backgroundColor: '#000' },
});

