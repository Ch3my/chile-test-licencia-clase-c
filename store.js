// store.js
import { create } from 'zustand';

export const useQuizStore = create((set) => ({
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
}));
