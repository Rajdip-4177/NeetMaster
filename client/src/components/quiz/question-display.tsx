import { useQuiz } from '@/context/quiz-context';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionDisplayProps {
  questionIndex: number;
}

export default function QuestionDisplay({ questionIndex }: QuestionDisplayProps) {
  const { quizQuestions, selectOption } = useQuiz();
  
  const question = quizQuestions[questionIndex];
  
  if (!question) {
    return <div>Question not found</div>;
  }
  
  const handleOptionSelect = (value: string) => {
    selectOption(questionIndex, parseInt(value));
  };
  
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">{question.questionText}</h3>
      
      <RadioGroup
        value={question.selectedOption?.toString() || ""}
        onValueChange={handleOptionSelect}
        className="space-y-3"
      >
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className={`
              flex items-start p-3 border rounded-lg cursor-pointer transition-all
              ${question.selectedOption === optionIndex ? 'border-primary bg-blue-50' : 'hover:bg-gray-50'}
            `}
          >
            <RadioGroupItem
              value={optionIndex.toString()}
              id={`option-${questionIndex}-${optionIndex}`}
              className="mt-1 mr-3"
            />
            <Label 
              htmlFor={`option-${questionIndex}-${optionIndex}`}
              className="cursor-pointer flex-1"
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
