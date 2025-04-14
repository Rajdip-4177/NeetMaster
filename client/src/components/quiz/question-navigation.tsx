import { useQuiz, QuestionStatus } from '@/context/quiz-context';
import { motion } from 'framer-motion';
import { CheckCircle, HelpCircle, BookmarkIcon, AlertTriangle } from 'lucide-react';

interface QuestionNavigationProps {
  vertical?: boolean;
}

export default function QuestionNavigation({ vertical = false }: QuestionNavigationProps) {
  const { 
    quizQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    getQuestionStatusColor,
    getQuizStats,
    getStatusLabel
  } = useQuiz();
  
  const stats = getQuizStats();
  
  return (
    <div className={vertical ? "" : "w-full"}>
      {!vertical && (
        <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-between items-center">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="bg-white rounded-lg shadow px-3 py-2 flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Answered: {stats.answered}</span>
            </div>
            <div className="bg-white rounded-lg shadow px-3 py-2 flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Not Answered: {stats.unanswered}</span>
            </div>
            <div className="bg-white rounded-lg shadow px-3 py-2 flex items-center">
              <div className="w-3 h-3 bg-purple-600 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Marked for Review: {stats.reviewed}</span>
            </div>
            <div className="bg-white rounded-lg shadow px-3 py-2 flex items-center">
              <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-purple-600 mr-2 rounded-full"></div>
              <span className="text-sm font-medium">Answered & Marked: {stats.answeredAndReviewed}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow px-3 py-2">
            <span className="text-sm font-medium">Total: {stats.total} Questions</span>
          </div>
        </div>
      )}
      
      <div className={vertical ? "" : "bg-white rounded-lg shadow-md p-4 mb-6"}>
        <h4 className="text-lg font-medium mb-4">{vertical ? "Question Navigation" : "Questions"}</h4>
        <div className={`grid ${vertical ? 'grid-cols-4' : 'grid-cols-5 md:grid-cols-10'} gap-2`}>
          {quizQuestions.map((question, index) => (
            <motion.button
              key={index}
              className={`
                h-10 w-10 flex items-center justify-center 
                rounded-lg text-sm font-medium transition-colors
                ${getQuestionStatusColor(question.status, index === currentQuestionIndex)}
                hover:opacity-90
              `}
              onClick={() => setCurrentQuestionIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={getStatusLabel(question.status)}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
      </div>
      
      {vertical && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">Question Status</h4>
          <div className="space-y-3 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Answered</span>
              </div>
              <span className="font-semibold">{stats.answered}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Not Answered</span>
              </div>
              <span className="font-semibold">{stats.unanswered}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookmarkIcon className="h-5 w-5 text-purple-600 mr-2" />
                <span>Marked for Review</span>
              </div>
              <span className="font-semibold">{stats.reviewed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                <span>Answered & Marked</span>
              </div>
              <span className="font-semibold">{stats.answeredAndReviewed}</span>
            </div>
            <div className="mt-1 pt-2 border-t border-gray-200 flex items-center justify-between font-medium">
              <span>Total Questions</span>
              <span>{stats.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
