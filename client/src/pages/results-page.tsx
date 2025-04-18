import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, Star, ArrowLeft, 
  Award, Target, BarChart3, BookmarkIcon, TrendingUp, FileText, 
  Printer, Download, Share2
} from 'lucide-react';
import { subjects } from '@/data/subjects';
import { chapters } from '@/data/chapters';
import { questions } from '@/data/questions';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

// Define the structure of quiz results from localStorage
interface StoredQuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeTaken: number;
  completedAt: string;
  subject: string;
  testId: string;
  questionData: {
    id: number;
    questionText: string;
    options: string[];
    correctOption: number;
    selectedOption: number | null;
    explanation?: string;
  }[];
}

export default function ResultsPage() {
  const { subject, chapter, testId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview');
  const [quizResults, setQuizResults] = useState<StoredQuizResults | null>(null);
  
  // Safely handle chapter value
  const safeChapter = chapter || '';
  
  // Load quiz results from localStorage
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('quizResults');
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults) as StoredQuizResults;
        
        // Verify that this is the correct quiz result (matching subject and testId)
        if (parsedResults.subject === subject && parsedResults.testId === testId) {
          setQuizResults(parsedResults);
        } else {
          // If there's a mismatch, we'll fall back to calculated results
          console.log('Quiz results in localStorage do not match current quiz');
        }
      }
    } catch (error) {
      console.error('Failed to load quiz results', error);
    }
  }, [subject, testId]);
  
  // If no stored results, calculate from questions data
  const calculateResults = () => {
    // Filter questions based on subject and test ID
    const filteredQuestions = questions.filter(
      q => q.subjectId === subject && q.testId === parseInt(testId || '0')
    );
    
    let correctCount = 0;
    let attemptedCount = 0;
    
    filteredQuestions.forEach(q => {
      if (q.selectedOptionIndex !== null) {
        attemptedCount++;
        if (q.selectedOptionIndex === q.correctOptionIndex) {
          correctCount++;
        }
      }
    });
    
    const totalQuestions = filteredQuestions.length;
    const score = correctCount * 4 - (attemptedCount - correctCount); // +4 for correct, -1 for incorrect
    const accuracy = totalQuestions > 0 && attemptedCount > 0
      ? Math.round((correctCount / attemptedCount) * 100) 
      : 0;
      
    return {
      score,
      totalMarks: totalQuestions * 4,
      correctAnswers: correctCount,
      incorrectAnswers: attemptedCount - correctCount,
      unattempted: totalQuestions - attemptedCount,
      totalQuestions,
      accuracy: isNaN(accuracy) ? 0 : accuracy,
      timeTaken: quizResults?.timeTaken 
        ? formatTime(quizResults.timeTaken) 
        : '21:45',
    };
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const [results] = useState(calculateResults());
  
  // Get current subject and chapter
  const currentSubject = subjects.find(s => s.id === subject);
  const currentChapter = chapters.find(c => c.id === safeChapter && c.subjectId === subject);
  
  // Get subject color class
  const getSubjectColorClass = (type: 'bg' | 'text' | 'border' | 'hover') => {
    if (!currentSubject) return '';
    
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
  
  // Toggle bookmark mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: async (questionId: number) => {
      if (bookmarked.includes(questionId)) {
        // Find the bookmark ID to delete it
        const bookmarkToDelete = bookmarked.find(id => id === questionId);
        if (bookmarkToDelete) {
          return apiRequest("DELETE", `/api/bookmarks/${bookmarkToDelete}`);
        }
      } else {
        // Create a new bookmark
        return apiRequest("POST", "/api/bookmarks", {
          userId: user?.id,
          subjectId: subject,
          chapterId: safeChapter,
          testId: testId,
          questionId: questionId.toString(),
        });
      }
    },
    onSuccess: (_, questionId) => {
      setBookmarked(prev => 
        prev.includes(questionId)
          ? prev.filter(id => id !== questionId)
          : [...prev, questionId]
      );
      
      toast({
        title: bookmarked.includes(questionId) ? "Bookmark removed" : "Question bookmarked",
        description: bookmarked.includes(questionId)
          ? "This question has been removed from your bookmarks."
          : "This question has been added to your bookmarks for future review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle bookmark handler
  const toggleBookmark = (questionId: number) => {
    toggleBookmarkMutation.mutate(questionId);
  };
  
  // Get performance indicator
  const getPerformanceLevel = () => {
    const { accuracy } = results;
    if (accuracy >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (accuracy >= 75) return { label: 'Good', color: 'text-blue-600' };
    if (accuracy >= 60) return { label: 'Average', color: 'text-yellow-600' };
    if (accuracy >= 40) return { label: 'Below Average', color: 'text-orange-600' };
    return { label: 'Needs Improvement', color: 'text-red-600' };
  };
  
  const performance = getPerformanceLevel();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };
  
  if (!currentSubject || !currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const testTitle = safeChapter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Use either the stored results or calculate from static data
  const finalResults = quizResults ? {
    score: quizResults.score,
    totalMarks: quizResults.totalQuestions * 4,
    correctAnswers: quizResults.correctAnswers,
    incorrectAnswers: quizResults.incorrectAnswers,
    unattempted: quizResults.unattempted,
    totalQuestions: quizResults.totalQuestions,
    accuracy: quizResults.totalQuestions > 0 && (quizResults.correctAnswers + quizResults.incorrectAnswers) > 0
      ? Math.round((quizResults.correctAnswers / (quizResults.correctAnswers + quizResults.incorrectAnswers)) * 100)
      : 0,
    timeTaken: formatTime(quizResults.timeTaken),
  } : results;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`${getSubjectColorClass('bg')} text-white p-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold">Quiz Results</h2>
              <p className="text-white text-opacity-90 mt-1">
                {currentSubject.name} - {testTitle}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 mr-2" />
              <span>Completed in {finalResults.timeTaken}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/4 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                <Award className="h-8 w-8 mb-2 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-1">Score</h3>
                <p className="text-3xl font-bold">
                  {finalResults.score}
                </p>
                <p className="text-sm text-white text-opacity-80">out of {finalResults.totalMarks}</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                <Target className="h-8 w-8 mb-2 text-green-300" />
                <h3 className="text-lg font-semibold mb-1">Accuracy</h3>
                <p className="text-3xl font-bold">{finalResults.accuracy}%</p>
                <p className="text-sm text-white text-opacity-80">{performance.label}</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-8 w-8 mb-2 text-green-300" />
                <h3 className="text-lg font-semibold mb-1">Correct</h3>
                <p className="text-3xl font-bold">{finalResults.correctAnswers}</p>
                <p className="text-sm text-white text-opacity-80">
                  out of {finalResults.totalQuestions} questions
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                <XCircle className="h-8 w-8 mb-2 text-red-300" />
                <h3 className="text-lg font-semibold mb-1">Incorrect</h3>
                <p className="text-3xl font-bold">{finalResults.incorrectAnswers}</p>
                <p className="text-sm text-white text-opacity-80">
                  {finalResults.unattempted} unattempted
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'overview' 
                  ? `${getSubjectColorClass('border')} ${getSubjectColorClass('text')}` 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Overview
              </span>
            </button>
            <button
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === 'analysis' 
                  ? `${getSubjectColorClass('border')} ${getSubjectColorClass('text')}` 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Question Analysis
              </span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-heading font-semibold mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 className="text-lg font-medium mb-3">Question Distribution</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-green-600">Correct</span>
                          <span className="text-sm font-medium">{finalResults.correctAnswers}/{finalResults.totalQuestions}</span>
                        </div>
                        <Progress value={(finalResults.correctAnswers / finalResults.totalQuestions) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-red-600">Incorrect</span>
                          <span className="text-sm font-medium">{finalResults.incorrectAnswers}/{finalResults.totalQuestions}</span>
                        </div>
                        <Progress value={(finalResults.incorrectAnswers / finalResults.totalQuestions) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Unattempted</span>
                          <span className="text-sm font-medium">{finalResults.unattempted}/{finalResults.totalQuestions}</span>
                        </div>
                        <Progress value={(finalResults.unattempted / finalResults.totalQuestions) * 100} className="h-2 bg-gray-200" indicatorClassName="bg-gray-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h4 className="text-lg font-medium mb-3">Score Analysis</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-medium">Correct Answers</h5>
                            <p className="text-sm text-gray-600">+{finalResults.correctAnswers * 4} points</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-green-600">+{finalResults.correctAnswers * 4}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                          </div>
                          <div>
                            <h5 className="font-medium">Incorrect Answers</h5>
                            <p className="text-sm text-gray-600">-{finalResults.incorrectAnswers} points</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-red-600">-{finalResults.incorrectAnswers}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Award className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium">Total Score</h5>
                            <p className="text-sm text-gray-600">Out of {finalResults.totalMarks}</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{finalResults.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading font-semibold">Recommended Actions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <BookmarkIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Review Bookmarked Questions</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Focus on the questions you've bookmarked for review to improve your understanding.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Practice More Tests</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Take more practice tests on this chapter to reinforce your knowledge and improve scores.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Focus on Weak Areas</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay special attention to concepts where you made mistakes or left questions unanswered.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex justify-between mt-10">
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <Printer className="h-4 w-4 mr-1" />
                    Print Results
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/subject/${subject}/${safeChapter}`}>
                    <Button variant="outline" className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Chapter
                    </Button>
                  </Link>
                  <Link href={`/subject/${subject}/${safeChapter}/test/${testId}`}>
                    <Button className={`${getSubjectColorClass('bg')} ${getSubjectColorClass('hover')} text-white`}>
                      Retry Quiz
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.h3 variants={itemVariants} className="text-xl font-heading font-semibold mb-4">
                Question Analysis
              </motion.h3>
              
              {quizResults?.questionData ? (
                quizResults.questionData.map((question: {
                  id: number;
                  questionText: string;
                  options: string[];
                  correctOption: number;
                  selectedOption: number | null;
                  explanation?: string;
                }, index: number) => (
                  <motion.div 
                    key={question.id} 
                    className="bg-white rounded-lg shadow-sm p-4 mb-4"
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                          Question {index + 1}
                        </span>
                        {question.selectedOption === question.correctOption ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-medium flex items-center">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Correct
                          </span>
                        ) : question.selectedOption !== null ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-medium flex items-center">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Incorrect
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-medium flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            Unattempted
                          </span>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(question.id)}
                        className={`
                          p-2 h-8 w-8 rounded-full 
                          ${bookmarked.includes(question.id) ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-purple-600'}
                        `}
                      >
                        <BookmarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-3">{question.questionText}</h4>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex}
                          className={`
                            flex items-start p-3 rounded-lg border
                            ${optionIndex === question.correctOption
                              ? 'bg-green-50 border-green-200'
                              : optionIndex === question.selectedOption && optionIndex !== question.correctOption
                                ? 'bg-red-50 border-red-200'
                                : 'border-gray-200 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-center h-5 mr-3">
                            <div className="text-sm font-bold w-5 h-5 flex items-center justify-center">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                          </div>
                          
                          <div className="flex flex-1 justify-between items-center">
                            <div>{option}</div>
                            <div className="flex items-center ml-4">
                              {optionIndex === question.correctOption && (
                                <span className="text-green-600 font-medium flex items-center text-sm">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Correct
                                </span>
                              )}
                              {optionIndex === question.selectedOption && optionIndex !== question.correctOption && (
                                <span className="text-red-600 font-medium flex items-center text-sm">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Your answer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Explanation:</h5>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quiz data not available</h3>
                  <p className="text-gray-600 mb-4">
                    Detailed question analysis is not available for this quiz. This might happen 
                    if you're viewing an older quiz result or if there was an issue saving your answers.
                  </p>
                  <Button
                    onClick={() => navigate(`/subject/${subject}/${safeChapter}`)}
                    className={`${getSubjectColorClass('bg')} ${getSubjectColorClass('hover')} text-white`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Chapter
                  </Button>
                </div>
              )}
              
              <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                <Link href={`/subject/${subject}/${safeChapter}`}>
                  <Button 
                    variant="link" 
                    className={`${getSubjectColorClass('text')} p-0 flex items-center`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Chapter
                  </Button>
                </Link>
                <Link href={`/subject/${subject}/${safeChapter}/test/${testId}`}>
                  <Button className={`${getSubjectColorClass('bg')} ${getSubjectColorClass('hover')} text-white`}>
                    Retry Quiz
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
