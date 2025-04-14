import { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { QuizProvider, useQuiz } from '@/context/quiz-context';
import { Separator } from '@/components/ui/separator';
import QuizTimer from '@/components/quiz/quiz-timer';
import QuestionDisplay from '@/components/quiz/question-display';
import QuestionNavigation from '@/components/quiz/question-navigation';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { subjects } from '@/data/subjects';
import { chapters } from '@/data/chapters';

function QuizContent() {
  const { subject, chapter, testId } = useParams();
  const [, navigate] = useLocation();
  const { 
    quizQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    toggleMarkForReview, 
    submitQuiz,
    isSubmitted
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
  const getSubjectColorClass = () => {
    if (!currentSubject) return 'bg-primary';
    
    const colors = {
      biology: 'bg-[#4CAF50]',
      physics: 'bg-[#2196F3]',
      chemistry: 'bg-[#FF9800]'
    };
    
    return colors[currentSubject.id as keyof typeof colors];
  };

  if (!currentSubject || !currentChapter) {
    return <div>Loading...</div>;
  }

  const testTitle = `Test ${testId}: ${chapter.replaceAll('-', ' ')}`;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Quiz Header */}
        <div className={`${getSubjectColorClass()} text-white p-4 flex justify-between items-center`}>
          <h2 className="text-xl font-heading font-semibold">{testTitle}</h2>
          <QuizTimer />
        </div>

        {/* Quiz Content */}
        <div className="flex flex-col md:flex-row">
          {/* Main Question Box */}
          <div className="md:w-3/4 p-6 border-r border-gray-200">
            <div className="mb-8">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mb-2">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
              
              <QuestionDisplay questionIndex={currentQuestionIndex} />
            </div>

            {/* Quiz Footer Controls */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => toggleMarkForReview(currentQuestionIndex)}
                className="flex items-center border-primary text-primary hover:bg-primary hover:text-white"
              >
                <BookmarkIcon className="h-5 w-5 mr-1" />
                Mark for Review
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
                  className={`${getSubjectColorClass()} text-white hover:bg-opacity-90`}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? (
                    'Submit Quiz'
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
          <div className="md:w-1/4 p-6 bg-gray-50">
            <QuestionNavigation />
            
            <Button
              onClick={submitQuiz}
              className="w-full mt-8 bg-red-500 text-white hover:bg-red-600"
            >
              Submit Quiz
            </Button>
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
