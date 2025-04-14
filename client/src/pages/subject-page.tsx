import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { chapters } from "@/data/chapters";
import { subjects } from "@/data/subjects";
import { Button } from "@/components/ui/button";

export default function SubjectPage() {
  const { subject } = useParams();
  const [, navigate] = useLocation();
  const [subjectChapters, setSubjectChapters] = useState<typeof chapters[0][]>([]);
  const [currentSubject, setCurrentSubject] = useState<typeof subjects[0] | undefined>(undefined);
  
  useEffect(() => {
    // Find the current subject
    const subjectData = subjects.find(s => s.id === subject);
    setCurrentSubject(subjectData);
    
    if (!subjectData) {
      // If subject not found, navigate to home
      navigate("/");
      return;
    }
    
    // Filter chapters for current subject
    const filteredChapters = chapters.filter(c => c.subjectId === subject);
    setSubjectChapters(filteredChapters);
  }, [subject, navigate]);
  
  // Get color class based on subject
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      {currentSubject && (
        <>
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mr-4 text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className={`text-3xl font-heading font-bold ${getSubjectColorClass('text')}`}>
              {currentSubject.name}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectChapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-heading font-semibold mb-3">
                  {chapter.name}
                </h2>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{chapter.questionCount} Questions</span>
                  <span>{chapter.notesCount} Study Notes</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {chapter.description}
                </p>
                <Link href={`/subject/${subject}/${chapter.id}`}>
                  <Button 
                    variant="link" 
                    className={`p-0 ${getSubjectColorClass('text')} font-medium flex items-center`}
                  >
                    Start Learning
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-1" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
