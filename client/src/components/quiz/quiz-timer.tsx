import { useQuiz } from '@/context/quiz-context';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function QuizTimer() {
  const { timeRemaining, quizDuration } = useQuiz();
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Initialize and update elapsed time
  useEffect(() => {
    setElapsedTime(quizDuration - timeRemaining);
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [quizDuration]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs} remaining`;
  };
  
  // Format elapsed time
  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs} elapsed`;
  };
  
  // Get timer color class
  const getTimerColorClass = () => {
    if (timeRemaining < 60) { // Less than 1 minute
      return 'text-red-500 animate-pulse font-bold';
    } else if (timeRemaining < 300) { // Less than 5 minutes
      return 'text-orange-400 font-semibold';
    }
    return '';
  };
  
  return (
    <div className="flex flex-col items-end text-sm">
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-1" />
        <span className={getTimerColorClass()}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      <div className="text-xs opacity-80 mt-1">
        {formatElapsedTime(elapsedTime)}
      </div>
    </div>
  );
}
