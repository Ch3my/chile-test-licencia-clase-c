// app/quiz.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  } = useQuizStore();

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

  const onSelectAnswer = (questionId, choiceId, type) => {
    if (quizFinished) return; // Do nothing if quiz is finished.
    const current = userAnswers[questionId] || [];
    if (type === 'single') {
      // For single‑choice questions, only one answer is allowed.
      answerQuestion(questionId, [choiceId]);
    } else if (type === 'multiple') {
      // For multiple‑choice questions, toggle the selection.
      let newSelection;
      if (current.includes(choiceId)) {
        newSelection = current.filter((item) => item !== choiceId);
      } else {
        newSelection = [...current, choiceId];
      }
      answerQuestion(questionId, newSelection);
    }
  };

  const onFinishQuiz = () => {
    finishQuiz();

    // Calculate the user's score and the percentage of correct answers.
    let userScore = 0;
    let correctCount = 0;
    let totalPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points; // Add question's points.
      const userAnswer = userAnswers[question.id] || [];
      const correctAnswers = question.correctAnswers;
      // Consider the question correct if the user's selection exactly matches the correct answers.
      if (
        userAnswer.length === correctAnswers.length &&
        userAnswer.every((ans) => correctAnswers.includes(ans))
      ) {
        userScore += question.points;
        correctCount += 1;
      }
    });

    // Calculate the percentage of correct answers.
    const percentage = ((correctCount / questions.length) * 100).toFixed(2);
    const passed = userScore >= 33;
    Alert.alert(
      "Quiz Completed",
      `Your score: ${userScore}/${totalPoints}\n` +
        `You ${passed ? "passed" : "failed"} the quiz.\n` +
        `Correct answers: ${percentage}%`
    );
  };

  const onResetQuiz = () => {
    resetQuiz();
    router.push('/');
  };

  // Format seconds into MM:SS.
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.quizContainer}>
      {/* Top Bar: Timer and progress */}
      <View style={styles.topBar}>
        <Text style={styles.timerText}>Time Remaining: {formatTime(timer)}</Text>
        <Text style={styles.progressText}>
          Answered: {Object.keys(userAnswers).length} / {questions.length}
        </Text>
      </View>

      {/* Questions List */}
      <ScrollView style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <Text style={styles.questionText}>
              {index + 1}. {question.question} ({question.points} pts)
            </Text>
            {question.image ? (
              <Image
                source={{ uri: question.image }}
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
                    // When quiz is not finished, show selected state.
                    !quizFinished && selected && styles.selectedChoice,
                    // When quiz is finished, mark correct answers green.
                    quizFinished && isCorrect && styles.correctChoice,
                    // Mark any selected incorrect answers red.
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
        ))}
      </ScrollView>

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

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
  },
  questionsContainer: {
    flex: 1,
  },
  questionCard: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  questionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  choiceButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedChoice: {
    backgroundColor: '#ddd',
  },
  correctChoice: {
    backgroundColor: '#8f8', // Green for correct answers.
  },
  incorrectChoice: {
    backgroundColor: '#f88', // Red for incorrect answers.
  },
  choiceText: {
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
});
