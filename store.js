// store.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useQuizStore = create((set, get) => ({
  // Quiz State
  questions: [],
  userAnswers: {},
  timer: 2700, // 45 minutes in seconds
  quizFinished: false,
  setQuestions: (questions) => set({ questions }),
  answerQuestion: (questionId, selected) =>
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [questionId]: selected,
      },
    })),
  finishQuiz: () => set({ quizFinished: true }),
  resetQuiz: () => set({ questions: [], userAnswers: {}, timer: 2700, quizFinished: false }),
  decrementTimer: () =>
    set((state) => ({ timer: state.timer > 0 ? state.timer - 1 : 0 })),

  // Theme State
  // theme: useColorScheme(), // Get system preference initially
  theme: "light", // Get system preference initially
  loadTheme: async () => {
    const storedTheme = await AsyncStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      set({ theme: storedTheme });
    }
  },
  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });
    await AsyncStorage.setItem('theme', newTheme);
  },
}));
