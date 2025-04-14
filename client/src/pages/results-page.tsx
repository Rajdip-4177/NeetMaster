import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, AlertCircle, Star, ArrowLeft } from 'lucide-react';
import { subjects } from '@/data/subjects';
import { chapters } from '@/data/chapters';
import { questions } from '@/data/questions';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export default function ResultsPage() {
  const { subject, chapter, testId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  
  // Mock results data
  const [results, setResults] = useState({
    score: 68,
    totalMarks: 100,
    correctAnswers: 18,
    totalQuestions: 25,
    accuracy: 72,
    timeTaken: '21:45',
  });
  
  // Get filtered quiz questions
  const filteredQuestions = questions.filter(
    q => q.subjectId === subject && q.testId === parseInt(testId || '0')
  );
  
  // Get current subject and chapter
  const currentSubject = subjects.find(s => s.id === subject);
  const currentChapter = chapters.find(c => c.id === chapter && c.subjectId === subject);
  
  // Get subject color class
  const getSubjectColorClass = (type: 'bg' | 'text' | 'border' | 'hover') => {
    if (!currentSubject) return '';
    
    const colors = {
      biology: {
        bg: 'bg-[#4CAF50]',
        text: 'text-[#4CAF50]',
        border: 'border-[#4CAF50]',
        hover: 'hover:bg-[#4CAF50]/90'
      },
      physics: {
        bg: 'bg-[#2196F3]',
        text: 'text-[#2196F3]',
        border: 'border-[#2196F3]',
        hover: 'hover:bg-[#2196F3]/90'
      },
      chemistry: {
        bg: 'bg-[#FF9800]',
        text: 'text-[#FF9800]',
        border: 'border-[#FF9800]',
        hover: 'hover:bg-[#FF9800]/90'
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
          chapterId: chapter,
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
  
  if (!currentSubject || !currentChapter) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`${getSubjectColorClass('bg')} text-white p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading font-semibold">Quiz Results</h2>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>Completed in {results.timeTaken}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/3 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Score</h3>
                <p className="text-3xl font-bold">
                  {results.score} / {results.totalMarks}
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Correct Answers</h3>
                <p className="text-3xl font-bold">
                  {results.correctAnswers} / {results.totalQuestions}
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 p-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
                <p className="text-3xl font-bold">{results.accuracy}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-heading font-semibold mb-4">Question Analysis</h3>
          
          {/* Question Analysis */}
          <div className="space-y-6">
            {filteredQuestions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-yellow-500 hover:text-yellow-600 p-1 h-auto`}
                      onClick={() => toggleBookmark(question.id)}
                    >
                      {bookmarked.includes(question.id) ? (
                        <Star className="h-5 w-5 fill-yellow-500" />
                      ) : (
                        <Star className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-3">{question.questionText}</h4>
                  
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`
                          flex items-start p-2 rounded-lg
                          ${optionIndex === question.correctOptionIndex
                            ? 'bg-green-100 border border-green-500'
                            : optionIndex === question.selectedOptionIndex && optionIndex !== question.correctOptionIndex
                              ? 'bg-red-100 border border-red-500'
                              : ''
                          }
                        `}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <div>
                          {option}
                          {optionIndex === question.correctOptionIndex && (
                            <span className="ml-2 text-green-500 font-medium flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Correct Answer
                            </span>
                          )}
                          {optionIndex === question.selectedOptionIndex && optionIndex !== question.correctOptionIndex && (
                            <span className="ml-2 text-red-500 font-medium flex items-center">
                              <XCircle className="h-4 w-4 mr-1" />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 text-primary" />
                        Explanation:
                      </h5>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between">
            <Link href={`/subject/${subject}/${chapter}`}>
              <Button 
                variant="link" 
                className={`${getSubjectColorClass('text')} p-0 flex items-center`}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Chapter
              </Button>
            </Link>
            <Link href={`/subject/${subject}/${chapter}/test/${testId}`}>
              <Button className={`${getSubjectColorClass('bg')} ${getSubjectColorClass('hover')} text-white`}>
                Retry Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
