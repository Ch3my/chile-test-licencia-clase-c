// styles.js
import { StyleSheet } from 'react-native';

const APP_FONT_SIZE = 17
/* ====================
   Layout Styles
   ==================== */

export const layoutLightStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    fontSize: APP_FONT_SIZE,
    color: '#000000',
  },
});

export const layoutDarkStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop:20
  },
  text: {
    fontSize: APP_FONT_SIZE,
    color: '#ffffff',
  },
});

/* ====================
   Quiz Styles
   ==================== */

// Quiz - Light Mode Styles
export const quizLightStyles = StyleSheet.create({
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
  timerText: {
    fontSize: APP_FONT_SIZE,
    fontWeight: 'bold',
    color: '#000',
  },
  progressText: {
    fontSize: APP_FONT_SIZE,
    color: '#000',
  },
  questionsContainer: {
    paddingBottom: 20,
  },
  questionCard: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  questionText: {
    fontSize: APP_FONT_SIZE,
    marginBottom: 5,
    color: '#000',
  },
  // Style for images in questions
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
    backgroundColor: '#8f8',
  },
  incorrectChoice: {
    backgroundColor: '#f88',
  },
  choiceText: {
    fontSize: APP_FONT_SIZE,
    color: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  explanationSection: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  explanationHeader: {
    fontSize: APP_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  explanationText: {
    fontSize: APP_FONT_SIZE,
    color: '#333',
  },
  explanationIcon: {
    fontSize: APP_FONT_SIZE,
    marginRight: 5,
  },
  explanationHeaderContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: "center",
    marginBottom: 5,
  }
});

// Quiz - Dark Mode Styles
export const quizDarkStyles = StyleSheet.create({
  ...quizLightStyles,
  quizContainer: {
    ...quizLightStyles.quizContainer,
    backgroundColor: '#121212',
  },
  topBar: {
    ...quizLightStyles.topBar,
    backgroundColor: '#333',
  },
  timerText: {
    ...quizLightStyles.timerText,
    color: '#fff',
  },
  progressText: {
    ...quizLightStyles.progressText,
    color: '#fff',
  },
  questionCard: {
    ...quizLightStyles.questionCard,
    backgroundColor: '#222',
    borderColor: '#444',
  },
  questionText: {
    ...quizLightStyles.questionText,
    color: '#fff',
  },
  choiceButton: {
    ...quizLightStyles.choiceButton,
    borderColor: '#666',
  },
  choiceText: {
    ...quizLightStyles.choiceText,
    color: '#fff',
  },
  selectedChoice: {
    backgroundColor: '#000',
  },
  correctChoice: {
    backgroundColor: '#006400',
  },
  incorrectChoice: {
    backgroundColor: '#8B0000',
  },
  explanationSection: {
    ...quizLightStyles.explanationSection,
    borderColor: '#444',
    backgroundColor: '#333',
  },
  explanationHeader: {
    ...quizLightStyles.explanationHeader,
    color: '#fff',
  },
  explanationText: {
    ...quizLightStyles.explanationHeader,
    color: '#ccc',
  },
});

export default layoutLightStyles