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
    '122': require('./data/122.jpg'),
    '135': require('./data/135.jpg'),
    '151': require('./data/151.jpg'),
    '182': require('./data/182.jpg'),
    '183': require('./data/183.jpg'),
    '184': require('./data/184.jpg'),
    '185': require('./data/185.jpg'),
    '186': require('./data/186.jpg'),
    '187': require('./data/187.jpg'),
    '188': require('./data/188.jpg'),
    '189': require('./data/189.jpg'),
    '191': require('./data/191.jpg'),
    '193': require('./data/193.jpg'),
    '194': require('./data/194.jpg'),
    '195': require('./data/195.jpg'),
    '196': require('./data/196.jpg'),
    '197': require('./data/197.jpg'),
    '200': require('./data/200.jpg'),
    '201': require('./data/201.jpg'),
    '202': require('./data/202.jpg'),
    '203': require('./data/203.jpg'),
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