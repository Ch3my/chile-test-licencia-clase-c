// app/quiz.js
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store';
import { quizLightStyles, quizDarkStyles } from './styles';
import imageMap from './imageMap'

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
  const styles = isDarkMode ? quizDarkStyles : quizLightStyles;

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer();
      const currentTimer = useQuizStore.getState().timer;
      if (currentTimer <= 0) {
        clearInterval(interval);
        Alert.alert(
          "Se acabo el tiempo",
          'Los 45 minutos se terminaron, pero puedes continuar el test'
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
      'Test Completado',
      `Tu puntuacion: ${userScore}/${totalPoints}\n` +
      `Test ${passed ? 'aprobado' : 'fallado'}.\n` +
      `Respuestas correctas: ${percentage}%`
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
        {(quizFinished && question.explanation) && (
          <View style={styles.explanationSection}>
            <View style={styles.explanationHeaderContainer}>
              <Text style={styles.explanationIcon}>ℹ️</Text>
              <Text style={styles.explanationHeader}>Explicación</Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
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
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(question) => question.id.toString()}
        contentContainerStyle={styles.questionsContainer}
      />
      {/* Bottom Bar: Finish and Reset buttons */}
      <View style={styles.bottomBar}>
        <Button title="Comenzar de nuevo" onPress={onResetQuiz} />
        <Button
          title="Revisar Test"
          onPress={onFinishQuiz}
          disabled={quizFinished}
        />
      </View>
    </View>
  );
}