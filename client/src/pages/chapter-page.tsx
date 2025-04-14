import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Clock } from "lucide-react";
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

  // Mock tests data
  const mockTests = [
    { id: 1, title: "Cell Structure & Function", description: "Test your knowledge about cell structure, organelles and their functions." },
    { id: 2, title: "Cell Membrane & Transport", description: "Evaluate your understanding of cell membrane structure and transport mechanisms." },
    { id: 3, title: "Cell Division", description: "Test your knowledge of mitosis, meiosis and cell cycle regulation." },
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTests.map((test) => (
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
                        25 Questions • {subject === "physics" ? "35" : "25"} minutes
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
