import { useQuiz } from '@/context/quiz-context';
import { Clock } from 'lucide-react';

export default function QuizTimer() {
  const { timeRemaining } = useQuiz();
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs} remaining`;
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
    <div className="flex items-center">
      <Clock className="h-5 w-5 mr-1" />
      <span className={getTimerColorClass()}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
