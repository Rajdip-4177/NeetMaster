import { useQuiz } from '@/context/quiz-context';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';

interface QuestionDisplayProps {
  questionIndex: number;
}

export default function QuestionDisplay({ questionIndex }: QuestionDisplayProps) {
  const { quizQuestions, selectOption } = useQuiz();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  
  const question = quizQuestions[questionIndex];
  
  // Update the selected value when question changes
  useEffect(() => {
    if (question && question.selectedOption !== null) {
      setSelectedValue(question.selectedOption.toString());
    } else {
      setSelectedValue(undefined);
    }
  }, [question, questionIndex]);
  
  if (!question) {
    return <div>Question not found</div>;
  }
  
  const handleOptionSelect = (value: string) => {
    setSelectedValue(value);
    selectOption(questionIndex, parseInt(value));
  };
  
  // Manual option selection (as a backup for the RadioGroup)
  const handleOptionClick = (optionIndex: number) => {
    setSelectedValue(optionIndex.toString());
    selectOption(questionIndex, optionIndex);
  };
  
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">{question.questionText}</h3>
      
      <RadioGroup
        value={selectedValue || ""}
        onValueChange={handleOptionSelect}
        className="space-y-3"
      >
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            onClick={() => handleOptionClick(optionIndex)}
            className={`
              flex items-start p-3 border rounded-lg cursor-pointer transition-all
              ${question.selectedOption === optionIndex || selectedValue === optionIndex.toString() 
                ? 'border-primary bg-blue-50 shadow-sm' 
                : 'hover:bg-gray-50 hover:border-gray-300'}
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
