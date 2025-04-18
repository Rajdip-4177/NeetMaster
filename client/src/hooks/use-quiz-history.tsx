import { useState, useEffect } from 'react';
import { subjects } from '@/data/subjects';
import { chapters } from '@/data/chapters';

// Define types for quiz results
export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeTaken: number;
  completedAt: string;
  subject: string;
  subjectName: string;
  chapter: string;
  chapterName: string;
  testId: string;
  accuracy: number;
}

export interface SubjectPerformance {
  name: string;
  id: string;
  score: number;
  testsCount: number;
}

export interface WeakChapter {
  id: string;
  name: string;
  subject: string;
  subjectId: string;
  accuracy: number;
  lastAttempted: string;
}

export interface StreakData {
  current: number;
  longest: number;
}

// Get formatted date string
const getFormattedDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  // Format as MMM DD
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function useQuizHistory() {
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [weakChapters, setWeakChapters] = useState<WeakChapter[]>([]);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0 });
  const [scoreOverTime, setScoreOverTime] = useState<{ date: string; score: number }[]>([]);
  const [bestTest, setBestTest] = useState<QuizResult | null>(null);
  const [worstTest, setWorstTest] = useState<QuizResult | null>(null);
  
  // Load quiz history from localStorage
  useEffect(() => {
    setLoading(true);
    
    try {
      // Get all items from localStorage and extract quiz results
      const allResults: QuizResult[] = [];
      
      const storedResults = localStorage.getItem('quizResults');
      
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults);
          
          // Check if it's a valid quiz result
          if (
            parsedResults && 
            typeof parsedResults === 'object' && 
            'score' in parsedResults &&
            'subject' in parsedResults
          ) {
            const subjectData = subjects.find(s => s.id === parsedResults.subject);
            const chapterData = chapters.find(c => 
              c.id === parsedResults.chapter && 
              c.subjectId === parsedResults.subject
            );
            
            // Calculate accuracy
            const accuracy = parsedResults.totalQuestions > 0 && 
              (parsedResults.correctAnswers + parsedResults.incorrectAnswers) > 0
              ? Math.round((parsedResults.correctAnswers / 
                  (parsedResults.correctAnswers + parsedResults.incorrectAnswers)) * 100)
              : 0;
              
            allResults.push({
              id: `${parsedResults.subject}-${parsedResults.testId}-${parsedResults.completedAt}`,
              score: parsedResults.score,
              totalQuestions: parsedResults.totalQuestions,
              correctAnswers: parsedResults.correctAnswers,
              incorrectAnswers: parsedResults.incorrectAnswers,
              unattempted: parsedResults.unattempted,
              timeTaken: parsedResults.timeTaken,
              completedAt: parsedResults.completedAt,
              subject: parsedResults.subject,
              subjectName: subjectData?.name || parsedResults.subject,
              chapter: parsedResults.chapter || '',
              chapterName: chapterData?.name || '',
              testId: parsedResults.testId,
              accuracy: accuracy
            });
          }
        } catch (err) {
          console.error('Failed to parse quiz results', err);
        }
      }
      
      // Sort by completed date, most recent first
      allResults.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      
      setQuizHistory(allResults);
      
      // Process subject performance
      const subjectMap = new Map<string, { totalScore: number; testCount: number }>();
      
      allResults.forEach(result => {
        const existing = subjectMap.get(result.subject) || { totalScore: 0, testCount: 0 };
        subjectMap.set(result.subject, {
          totalScore: existing.totalScore + result.score,
          testCount: existing.testCount + 1
        });
      });
      
      const subjectData: SubjectPerformance[] = [];
      
      subjectMap.forEach((value, key) => {
        const subject = subjects.find(s => s.id === key);
        if (subject) {
          subjectData.push({
            id: key,
            name: subject.name,
            score: Math.round(value.totalScore / value.testCount),
            testsCount: value.testCount
          });
        }
      });
      
      setSubjectPerformance(subjectData);
      
      // Process weak chapters
      const chapterMap = new Map<string, { 
        accuracy: number; 
        attempts: number; 
        lastAttempted: string;
        subjectId: string;
        name: string;
      }>();
      
      allResults.forEach(result => {
        if (!result.chapter) return;
        
        const chapter = chapters.find(c => c.id === result.chapter && c.subjectId === result.subject);
        if (!chapter) return;
        
        const existing = chapterMap.get(result.chapter) || { 
          accuracy: 0, 
          attempts: 0, 
          lastAttempted: result.completedAt,
          subjectId: result.subject,
          name: chapter.name
        };
        
        // Calculate new average accuracy
        const newAccuracy = (existing.accuracy * existing.attempts + result.accuracy) / (existing.attempts + 1);
        
        chapterMap.set(result.chapter, {
          accuracy: newAccuracy,
          attempts: existing.attempts + 1,
          lastAttempted: new Date(result.completedAt) > new Date(existing.lastAttempted) 
            ? result.completedAt 
            : existing.lastAttempted,
          subjectId: result.subject,
          name: chapter.name
        });
      });
      
      // Extract and sort weak chapters by accuracy
      const weakChaptersData: WeakChapter[] = [];
      
      chapterMap.forEach((value, key) => {
        const subject = subjects.find(s => s.id === value.subjectId);
        
        weakChaptersData.push({
          id: key,
          name: value.name,
          subject: subject?.name || value.subjectId,
          subjectId: value.subjectId,
          accuracy: Math.round(value.accuracy),
          lastAttempted: getFormattedDate(new Date(value.lastAttempted))
        });
      });
      
      // Sort by accuracy (lowest first)
      weakChaptersData.sort((a, b) => a.accuracy - b.accuracy);
      
      setWeakChapters(weakChaptersData.slice(0, 5)); // Get top 5 weak chapters
      
      // Process best and worst tests
      if (allResults.length > 0) {
        const best = allResults.reduce((prev, current) => 
          (prev.accuracy > current.accuracy) ? prev : current
        );
        
        const worst = allResults.reduce((prev, current) => 
          (prev.accuracy < current.accuracy) ? prev : current
        );
        
        setBestTest(best);
        setWorstTest(worst);
      }
      
      // Process score over time (format for charts)
      const chartData = allResults.map(result => ({
        date: new Date(result.completedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        score: result.score
      }));
      
      // Reverse to show chronological order
      setScoreOverTime(chartData.reverse());
      
      // Calculate streak
      calculateStreak(allResults);
    } catch (error) {
      console.error('Failed to load quiz history', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Calculate user's study streak
  const calculateStreak = (results: QuizResult[]) => {
    if (results.length === 0) {
      setStreak({ current: 0, longest: 0 });
      return;
    }
    
    // Group quiz attempts by day
    const dateMap = new Map<string, boolean>();
    
    results.forEach(result => {
      const date = new Date(result.completedAt).toISOString().split('T')[0];
      dateMap.set(date, true);
    });
    
    // Get sorted dates
    const sortedDates = Array.from(dateMap.keys()).sort();
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = today;
    
    // Check today first
    if (dateMap.has(checkDate)) {
      currentStreak = 1;
      
      // Then check consecutive previous days
      while (true) {
        const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
        
        if (dateMap.has(prevDate)) {
          currentStreak++;
          checkDate = prevDate;
        } else {
          break;
        }
      }
    } else {
      // Today doesn't have an attempt, check yesterday
      const yesterday = new Date(new Date().getTime() - 86400000).toISOString().split('T')[0];
      
      if (dateMap.has(yesterday)) {
        currentStreak = 1;
        checkDate = yesterday;
        
        // Then check consecutive previous days
        while (true) {
          const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
          
          if (dateMap.has(prevDate)) {
            currentStreak++;
            checkDate = prevDate;
          } else {
            break;
          }
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = currentStreak;
    let currentCount = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      
      // Check if dates are consecutive
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentCount++;
        longestStreak = Math.max(longestStreak, currentCount);
      } else {
        currentCount = 1;
      }
    }
    
    setStreak({ current: currentStreak, longest: longestStreak });
  };
  
  return {
    quizHistory,
    loading,
    subjectPerformance,
    weakChapters,
    streak,
    scoreOverTime,
    bestTest,
    worstTest
  };
} 