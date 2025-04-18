import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PdfViewer from "@/components/pdf-viewer";
import { subjects } from "@/data/subjects";
import { chapters } from "@/data/chapters";

export default function ChapterPage() {
  const { subject, chapter } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("test");
  const [currentSubject, setCurrentSubject] = useState<typeof subjects[0] | undefined>(undefined);
  const [currentChapter, setCurrentChapter] = useState<typeof chapters[0] | undefined>(undefined);

  useEffect(() => {
    // Find current subject and chapter
    const subjectData = subjects.find(s => s.id === subject);
    setCurrentSubject(subjectData);
    
    const chapterData = chapters.find(c => c.id === chapter && c.subjectId === subject);
    setCurrentChapter(chapterData);
    
    if (!subjectData || !chapterData) {
      // If subject or chapter not found, navigate back
      navigate("/");
    }
  }, [subject, chapter, navigate]);

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

  // Function to get a more detailed description based on quiz ID and chapter information
  const getQuizDescription = (testId: number, subject?: string, chapterName?: string) => {
    const subjectPrefix = subject ? {
      'biology': 'Biological ',
      'chemistry': 'Chemical ',
      'physics': 'Physical '
    }[subject] || '' : '';
    
    const chapterContext = chapterName ? ` on ${chapterName}` : '';
    
    switch(testId) {
      case 1:
        return `Focus on fundamental ${subjectPrefix}concepts and basic definitions${chapterContext}.`;
      case 2:
        return `Test your understanding of intermediate-level concepts and practical applications${chapterContext}.`;
      case 3:
        return `Advanced problems requiring deep conceptual understanding${chapterContext}.`;
      case 4:
        return `Questions focused on numerical problems and calculations${chapterContext}.`;
      case 5:
        return `Test covering relationships between different concepts and their interconnections${chapterContext}.`;
      case 6:
        return `Application-based questions connecting theory to real-world scenarios${chapterContext}.`;
      case 7:
        return `Diagram-based questions testing visual understanding${chapterContext}.`;
      case 8:
        return `Mixed-format quiz combining multiple question types${chapterContext}.`;
      case 9:
        return `NEET-style questions following the exact examination pattern${chapterContext}.`;
      case 10:
        return `Comprehensive review covering all major concepts${chapterContext}.`;
      default:
        return `Test your knowledge about key concepts covered${chapterContext}.`;
    }
  };

  // Function to get quiz title based on quiz ID
  const getQuizTitle = (testId: number) => {
    return `Quiz ${testId}`;
  };

  // Function to get question count based on quiz ID
  const getQuestionCount = (testId: number, subjectId?: string) => {
    // Different quiz types have different question counts
    const baseCount = {
      1: 15, // Fundamentals
      2: 20, // Intermediate 
      3: 25, // Advanced
      4: 20, // Numerical
      5: 15, // Connections
      6: 20, // Applications
      7: 15, // Visual
      8: 20, // Mixed
      9: 30, // NEET style
      10: 25, // Review
    }[testId] || 20;
    
    // Physics quizzes have slightly more questions
    return subjectId === 'physics' ? baseCount + 5 : baseCount;
  };
  
  // Function to get quiz duration in minutes
  const getQuizDuration = (testId: number, subjectId?: string) => {
    const questionCount = getQuestionCount(testId, subjectId);
    // Physics and Chemistry quizzes get more time per question than Biology
    const minutesPerQuestion = subjectId === 'biology' ? 1 : 1.5;
    return Math.round(questionCount * minutesPerQuestion);
  };

  // Generate 10 quizzes for each chapter
  const generateQuizzes = () => {
    const quizzes = [];
    for (let i = 1; i <= 10; i++) {
      quizzes.push({
        id: i,
        title: getQuizTitle(i),
        description: getQuizDescription(i, currentSubject?.id, currentChapter?.name),
        questionCount: getQuestionCount(i, currentSubject?.id),
        duration: getQuizDuration(i, currentSubject?.id)
      });
    }
    return quizzes;
  };

  // Mock tests data - now generated dynamically
  const mockTests = generateQuizzes();

  // Pagination for quizzes
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;
  const totalPages = Math.ceil(mockTests.length / quizzesPerPage);
  
  // Get current quizzes
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = mockTests.slice(indexOfFirstQuiz, indexOfLastQuiz);
  
  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {currentSubject && currentChapter && (
        <>
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/subject/${subject}`)}
              className="mr-4 text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <span className="text-sm text-gray-500 block">
                {currentSubject.name}
              </span>
              <h1 className="text-3xl font-heading font-bold">
                {currentChapter.name}
              </h1>
            </div>
          </div>

          <Tabs 
            defaultValue="test" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="mb-8 border-b border-gray-200">
              <TabsList className="flex justify-start p-0 bg-transparent">
                <TabsTrigger 
                  value="test" 
                  className={`py-4 px-1 ${
                    activeTab === "test" 
                      ? `${getSubjectColorClass('text')} border-b-2 ${getSubjectColorClass('border')}` 
                      : "text-gray-500"
                  } font-medium mr-8`}
                >
                  Test Yourself
                </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className={`py-4 px-1 ${
                    activeTab === "notes" 
                      ? `${getSubjectColorClass('text')} border-b-2 ${getSubjectColorClass('border')}` 
                      : "text-gray-500"
                  } font-medium mr-8`}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="ncert" 
                  className={`py-4 px-1 ${
                    activeTab === "ncert" 
                      ? `${getSubjectColorClass('text')} border-b-2 ${getSubjectColorClass('border')}` 
                      : "text-gray-500"
                  } font-medium`}
                >
                  NCERT
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="test" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentQuizzes.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-heading font-semibold mb-2">
                      {test.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>
                        {test.questionCount} Questions • {test.duration} minutes
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {test.description}
                    </p>
                    <Link href={`/subject/${subject}/${chapter}/test/${test.id}`}>
                      <Button 
                        className={`${getSubjectColorClass('bg')} ${getSubjectColorClass('hover')} text-white`}
                      >
                        Start Test
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="text-sm text-gray-600 px-3">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="pt-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4">Chapter Notes</h3>
                  <div className="border border-gray-200 rounded-lg p-8">
                    <PdfViewer 
                      title={`${currentChapter.name} Notes.pdf`}
                      pageCount={25}
                      type="notes"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ncert" className="pt-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4">NCERT Textbook</h3>
                  <div className="border border-gray-200 rounded-lg p-8">
                    <PdfViewer 
                      title={`NCERT ${currentSubject.name} - Chapter ${currentChapter.ncertChapter}: ${currentChapter.name}`}
                      pageCount={35}
                      type="ncert"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
