import { useQuiz } from '@/context/quiz-context';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionDisplayProps {
  questionIndex: number;
}

export default function QuestionDisplay({ questionIndex }: QuestionDisplayProps) {
  const { quizQuestions, selectOption } = useQuiz();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const [selectedWithClick, setSelectedWithClick] = useState<number | null>(null);
  
  const question = quizQuestions[questionIndex];
  
  // Update the selected value when question changes
  useEffect(() => {
    if (question && question.selectedOption !== null) {
      setSelectedValue(question.selectedOption.toString());
      setSelectedWithClick(question.selectedOption);
    } else {
      setSelectedValue(undefined);
      setSelectedWithClick(null);
    }
  }, [question, questionIndex]);
  
  if (!question) {
    return <div>Question not found</div>;
  }
  
  const handleOptionSelect = (value: string) => {
    setSelectedValue(value);
    const optionIndex = parseInt(value);
    setSelectedWithClick(optionIndex);
    selectOption(questionIndex, optionIndex);
  };
  
  // Manual option selection (as a backup for the RadioGroup)
  const handleOptionClick = (optionIndex: number) => {
    setSelectedValue(optionIndex.toString());
    setSelectedWithClick(optionIndex);
    selectOption(questionIndex, optionIndex);
  };

  // Determine if an option is selected using all available information
  const isOptionSelected = (optionIndex: number) => {
    return question.selectedOption === optionIndex || 
           selectedValue === optionIndex.toString() || 
           selectedWithClick === optionIndex;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-medium mb-6">{question.questionText}</h3>
      
      <div className="space-y-4">
        {question.options.map((option, optionIndex) => {
          const isSelected = isOptionSelected(optionIndex);
          
          return (
            <motion.div
              key={optionIndex}
              onClick={() => handleOptionClick(optionIndex)}
              className={`
                flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center h-6 mt-0.5">
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                ) : (
                  <div className={`h-5 w-5 rounded-full border-2 border-gray-400 mr-3 ${isSelected ? 'border-primary' : ''}`} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex mb-1">
                  <span className="font-medium mr-2 text-lg">{String.fromCharCode(65 + optionIndex)}.</span>
                  <span className={`text-lg ${isSelected ? 'font-medium text-primary' : ''}`}>{option}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Hidden RadioGroup for accessibility and keyboard navigation */}
      <div className="sr-only">
        <RadioGroup
          value={selectedValue || ""}
          onValueChange={handleOptionSelect}
        >
          {question.options.map((option, optionIndex) => (
            <RadioGroupItem
              key={optionIndex}
              value={optionIndex.toString()}
              id={`sr-option-${questionIndex}-${optionIndex}`}
            />
          ))}
        </RadioGroup>
      </div>
    </motion.div>
  );
}
