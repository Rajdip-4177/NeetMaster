import { useQuiz, QuestionStatus } from '@/context/quiz-context';

export default function QuestionNavigation() {
  const { 
    quizQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    getQuestionStatusColor
  } = useQuiz();
  
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Question Navigation</h4>
      <div className="grid grid-cols-5 gap-2">
        {quizQuestions.map((question, index) => (
          <button
            key={index}
            className={`
              h-10 w-10 flex items-center justify-center 
              rounded-lg text-sm font-medium transition-colors
              ${getQuestionStatusColor(question.status, index === currentQuestionIndex)}
            `}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 mr-2 rounded-full"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 mr-2 rounded-full"></span>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-600 mr-2 rounded-full"></span>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 mr-2 rounded-full"></span>
            <span>Current Question</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gradient-to-br from-green-500 to-purple-600 mr-2 rounded-full"></span>
            <span>Answered & Marked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
