import { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { QuizProvider, useQuiz } from '@/context/quiz-context';
import QuizTimer from '@/components/quiz/quiz-timer';
import QuestionDisplay from '@/components/quiz/question-display';
import QuestionNavigation from '@/components/quiz/question-navigation';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ArrowLeft, ArrowRight, AlertTriangle, CheckSquare } from 'lucide-react';
import { subjects } from '@/data/subjects';
import { chapters } from '@/data/chapters';
import { motion, AnimatePresence } from 'framer-motion';

function QuizContent() {
  const { subject, chapter, testId } = useParams();
  const [, navigate] = useLocation();
  const { 
    quizQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    toggleMarkForReview, 
    submitQuiz,
    isSubmitted,
    getQuizStats
  } = useQuiz();

  // If quiz is submitted, redirect to results page
  useEffect(() => {
    if (isSubmitted) {
      navigate(`/subject/${subject}/${chapter}/test/${testId}/results`);
    }
  }, [isSubmitted, navigate, subject, chapter, testId]);

  // Get current subject and chapter
  const currentSubject = subjects.find(s => s.id === subject);
  const currentChapter = chapters.find(c => c.id === chapter && c.subjectId === subject);

  // Get quiz statistics
  const quizStats = getQuizStats();

  // Handle navigation
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // On last question, next should submit the quiz
      submitQuiz();
    }
  };

  // Get subject color class
  const getSubjectColorClass = (type: 'bg' | 'text' | 'border' | 'hover' = 'bg') => {
    if (!currentSubject) return type === 'bg' ? 'bg-primary' : 'text-primary';
    
    const colors = {
      biology: {
        bg: 'bg-[#4CAF50]',
        text: 'text-[#4CAF50]',
        border: 'border-[#4CAF50]',
        hover: 'hover:bg-[#43A047]'
      },
      physics: {
        bg: 'bg-[#2196F3]',
        text: 'text-[#2196F3]',
        border: 'border-[#2196F3]',
        hover: 'hover:bg-[#1E88E5]'
      },
      chemistry: {
        bg: 'bg-[#FF9800]',
        text: 'text-[#FF9800]',
        border: 'border-[#FF9800]',
        hover: 'hover:bg-[#FB8C00]'
      }
    };
    
    return colors[currentSubject.id as keyof typeof colors][type];
  };

  if (!currentSubject || !currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const testTitle = `Test ${testId}: ${chapter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isMarkedForReview = currentQuestion?.isMarkedForReview;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {/* Quiz Header */}
        <div className={`${getSubjectColorClass()} text-white p-4 flex justify-between items-center`}>
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold">{testTitle}</h2>
            <p className="text-white text-opacity-90 text-sm mt-1">
              {currentSubject.name} - Chapter {currentChapter.ncertChapter}
            </p>
          </div>
          <QuizTimer />
        </div>

        {/* Top Question Navigation with Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <QuestionNavigation vertical={false} />
        </div>

        {/* Quiz Content */}
        <div className="flex flex-col md:flex-row">
          {/* Main Question Box */}
          <div className="md:w-3/4 p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
                {isMarkedForReview && (
                  <span className="inline-flex items-center text-sm text-purple-600 font-medium">
                    <BookmarkIcon className="h-4 w-4 mr-1" />
                    Marked for Review
                  </span>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <QuestionDisplay questionIndex={currentQuestionIndex} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quiz Footer Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => toggleMarkForReview(currentQuestionIndex)}
                className={`flex items-center ${
                  isMarkedForReview 
                    ? 'bg-purple-50 border-purple-400 text-purple-700 hover:bg-purple-100' 
                    : `border-primary ${getSubjectColorClass('text')} hover:bg-primary hover:text-white`
                }`}
              >
                <BookmarkIcon className="h-5 w-5 mr-2" />
                {isMarkedForReview ? 'Remove Review Mark' : 'Mark for Review'}
              </Button>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <Button
                  onClick={goToNext}
                  className={`${getSubjectColorClass()} text-white ${getSubjectColorClass('hover')}`}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? (
                    <>
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Submit Quiz
                    </>
                  ) : (
                    <>
                      Save & Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Question Navigation Sidebar */}
          <div className="md:w-1/4 p-6 bg-gray-50 border-l border-gray-200">
            <QuestionNavigation vertical={true} />
            
            <Button
              onClick={submitQuiz}
              className="w-full mt-8 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              <CheckSquare className="h-5 w-5" />
              Submit Quiz
            </Button>

            {quizStats.unanswered > 0 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>You have {quizStats.unanswered} unanswered questions. Make sure to answer all questions before submitting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}
