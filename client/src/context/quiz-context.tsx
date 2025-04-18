import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useParams } from 'wouter';
import { questions } from '@/data/questions';
import { subjects } from '@/data/subjects';

// Types
export type QuestionStatus = 'unanswered' | 'answered' | 'reviewed' | 'answered+reviewed';

export interface QuestionState {
  id: number;
  questionText: string;
  options: string[];
  correctOption: number;
  selectedOption: number | null;
  isMarkedForReview: boolean;
  status: QuestionStatus;
  explanation?: string;
}

interface QuizStats {
  total: number;
  answered: number;
  unanswered: number;
  reviewed: number;
  answeredAndReviewed: number;
}

interface QuizContextType {
  quizQuestions: QuestionState[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isSubmitted: boolean;
  score: number | null;
  setCurrentQuestionIndex: (index: number) => void;
  selectOption: (questionIndex: number, optionIndex: number) => void;
  toggleMarkForReview: (questionIndex: number) => void;
  submitQuiz: () => void;
  getQuestionStatusColor: (status: QuestionStatus, isCurrent: boolean) => string;
  quizDuration: number;
  getQuizStats: () => QuizStats;
  getStatusLabel: (status: QuestionStatus) => string;
  calculateElapsedTime: () => number;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { subject, testId } = useParams();
  
  // Filter quiz questions based on subject and test ID
  const filteredQuestions = questions.filter(
    q => q.subjectId === subject && q.testId === parseInt(testId || '0')
  );
  
  // Initialize quiz questions
  const [quizQuestions, setQuizQuestions] = useState<QuestionState[]>(
    filteredQuestions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      correctOption: q.correctOptionIndex,
      selectedOption: null,
      isMarkedForReview: false,
      status: 'unanswered',
      explanation: q.explanation,
    }))
  );
  
  // Get subject for determining quiz duration
  const currentSubject = subjects.find(s => s.id === subject);
  
  // Quiz duration in seconds (25 mins for Bio/Chem, 35 mins for Physics)
  const quizDuration = currentSubject?.id === 'physics' 
    ? 35 * 60 
    : 25 * 60;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quizDuration);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  // Timer
  useEffect(() => {
    // Start the timer
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          // If time runs out, submit the quiz and clear the interval
          if (prev <= 1) {
            setTimeout(() => submitQuiz(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Clean up the interval when the component unmounts or when the quiz is submitted
      return () => clearInterval(timer);
    }
  }, [isSubmitted]);
  
  // Select an option for a question
  const selectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    
    setQuizQuestions(prev => 
      prev.map((q, idx) => {
        if (idx === questionIndex) {
          const newStatus = q.isMarkedForReview ? 'answered+reviewed' : 'answered';
          return {
            ...q,
            selectedOption: optionIndex,
            status: newStatus,
          };
        }
        return q;
      })
    );
  };
  
  // Toggle mark for review
  const toggleMarkForReview = (questionIndex: number) => {
    if (isSubmitted) return;
    
    setQuizQuestions(prev => 
      prev.map((q, idx) => {
        if (idx === questionIndex) {
          const isMarked = !q.isMarkedForReview;
          let newStatus: QuestionStatus = isMarked ? 'reviewed' : 'unanswered';
          
          if (q.selectedOption !== null) {
            newStatus = isMarked ? 'answered+reviewed' : 'answered';
          }
          
          return {
            ...q,
            isMarkedForReview: isMarked,
            status: newStatus,
          };
        }
        return q;
      })
    );
  };
  
  // Calculate elapsed time (quiz duration - time remaining)
  const calculateElapsedTime = () => {
    return quizDuration - timeRemaining;
  };
  
  // Submit quiz
  const submitQuiz = () => {
    if (isSubmitted) return;
    
    let calculatedScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    
    quizQuestions.forEach(q => {
      if (q.selectedOption === q.correctOption) {
        calculatedScore += 4;
        correct++;
      } else if (q.selectedOption !== null) {
        calculatedScore -= 1;
        incorrect++;
      } else {
        unattempted++;
      }
    });
    
    // Record additional stats in localStorage for better result tracking
    try {
      const quizResults = {
        score: calculatedScore,
        totalQuestions: quizQuestions.length,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        unattempted: unattempted,
        timeTaken: calculateElapsedTime(),
        completedAt: new Date().toISOString(),
        subject: subject,
        testId: testId,
        // Store the actual question data with user's selections for results page
        questionData: quizQuestions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption,
          selectedOption: q.selectedOption,
          explanation: q.explanation
        }))
      };
      
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    } catch (e) {
      console.error("Failed to save quiz results", e);
    }
    
    setScore(calculatedScore);
    setIsSubmitted(true);
  };
  
  // Get color class for question status
  const getQuestionStatusColor = (status: QuestionStatus, isCurrent: boolean) => {
    if (isCurrent) return 'bg-blue-500 text-white'; // Current question
    
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white'; // Answered
      case 'unanswered':
        return 'bg-red-500 text-white'; // Not answered
      case 'reviewed':
        return 'bg-purple-600 text-white'; // Marked for review
      case 'answered+reviewed':
        return 'bg-gradient-to-br from-green-500 to-purple-600 text-white'; // Answered + marked
      default:
        return 'bg-red-500 text-white';
    }
  };

  // Get friendly label for status
  const getStatusLabel = (status: QuestionStatus) => {
    switch (status) {
      case 'answered':
        return 'Answered';
      case 'unanswered':
        return 'Not Answered';
      case 'reviewed':
        return 'Marked for Review';
      case 'answered+reviewed':
        return 'Answered & Marked for Review';
      default:
        return 'Unknown';
    }
  };

  // Calculate quiz statistics
  const getQuizStats = (): QuizStats => {
    const stats = {
      total: quizQuestions.length,
      answered: 0,
      unanswered: 0,
      reviewed: 0,
      answeredAndReviewed: 0
    };

    quizQuestions.forEach(q => {
      switch (q.status) {
        case 'answered':
          stats.answered++;
          break;
        case 'unanswered':
          stats.unanswered++;
          break;
        case 'reviewed':
          stats.reviewed++;
          break;
        case 'answered+reviewed':
          stats.answeredAndReviewed++;
          break;
      }
    });

    return stats;
  };
  
  return (
    <QuizContext.Provider
      value={{
        quizQuestions,
        currentQuestionIndex,
        timeRemaining,
        isSubmitted,
        score,
        setCurrentQuestionIndex,
        selectOption,
        toggleMarkForReview,
        submitQuiz,
        getQuestionStatusColor,
        quizDuration,
        getQuizStats,
        getStatusLabel,
        calculateElapsedTime
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
