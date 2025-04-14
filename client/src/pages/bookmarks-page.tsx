import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bookmark } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ChevronRight, 
  Loader2, 
  BookOpen, 
  Beaker, 
  Landmark,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { subjects } from "@/data/subjects";
import { chapters } from "@/data/chapters";
import { questions } from "@/data/questions";

// Helper function to find subject by ID
const getSubjectById = (id: string) => {
  return subjects.find(s => s.id === id);
};

// Helper function to find chapter by ID
const getChapterById = (id: string, subjectId: string) => {
  return chapters.find(c => c.id === id && c.subjectId === subjectId);
};

// Helper function to find question by ID
const getQuestionById = (id: string) => {
  return questions.find(q => q.id.toString() === id);
};

// Helper function to get subject icon
const getSubjectIcon = (subjectId: string) => {
  switch (subjectId) {
    case "biology":
      return <Landmark className="h-5 w-5" />;
    case "physics":
      return <BookOpen className="h-5 w-5" />;
    case "chemistry":
      return <Beaker className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
};

// Helper function to get subject color class
const getSubjectColorClass = (subjectId: string) => {
  switch (subjectId) {
    case "biology":
      return "text-[#4CAF50]";
    case "physics":
      return "text-[#2196F3]";
    case "chemistry":
      return "text-[#FF9800]";
    default:
      return "text-primary";
  }
};

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Fetch bookmarks
  const { data: bookmarks, isLoading } = useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
  });

  // Delete bookmark mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: number) => {
      await apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark removed",
        description: "The bookmark has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error removing bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle bookmark deletion
  const handleDeleteBookmark = (bookmarkId: number) => {
    deleteBookmarkMutation.mutate(bookmarkId);
  };

  // Filter bookmarks based on active tab
  const getFilteredBookmarks = () => {
    if (!bookmarks) return [];
    
    if (activeTab === "all") {
      return bookmarks;
    } else {
      return bookmarks.filter(bookmark => bookmark.subjectId === activeTab);
    }
  };

  // Group bookmarks by chapter
  const groupBookmarksByChapter = (bookmarks: Bookmark[]) => {
    const groupedBookmarks: { [key: string]: Bookmark[] } = {};
    
    bookmarks.forEach(bookmark => {
      const key = `${bookmark.subjectId}-${bookmark.chapterId}`;
      if (!groupedBookmarks[key]) {
        groupedBookmarks[key] = [];
      }
      groupedBookmarks[key].push(bookmark);
    });
    
    return groupedBookmarks;
  };

  const groupedBookmarks = groupBookmarksByChapter(getFilteredBookmarks());

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-primary text-white p-6">
          <div className="flex items-center">
            <Star className="h-6 w-6 mr-3" />
            <h2 className="text-2xl font-heading font-semibold">Bookmarked Questions</h2>
          </div>
          <p className="mt-2">Review all your bookmarked questions for revision</p>
        </div>
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="all">All Subjects</TabsTrigger>
              <TabsTrigger value="biology">Biology</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : Object.keys(groupedBookmarks).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedBookmarks).map(([key, bookmarksGroup]) => {
                    const [subjectId, chapterId] = key.split('-');
                    const subject = getSubjectById(subjectId);
                    const chapter = getChapterById(chapterId, subjectId);
                    
                    if (!subject || !chapter) return null;
                    
                    return (
                      <div key={key} className="border rounded-lg overflow-hidden">
                        <div className={`flex items-center p-4 bg-gray-50 border-b`}>
                          <div className={`${getSubjectColorClass(subjectId)} mr-3`}>
                            {getSubjectIcon(subjectId)}
                          </div>
                          <div>
                            <h3 className="font-medium">{subject.name} - {chapter.name}</h3>
                            <p className="text-sm text-gray-500">
                              {bookmarksGroup.length} bookmarked {bookmarksGroup.length === 1 ? 'question' : 'questions'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="divide-y">
                          {bookmarksGroup.map((bookmark) => {
                            const question = getQuestionById(bookmark.questionId);
                            
                            if (!question) return null;
                            
                            return (
                              <div key={bookmark.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between">
                                  <p className="mb-2 font-medium">{question.questionText}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                    onClick={() => handleDeleteBookmark(bookmark.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="mb-3 text-sm">
                                  <div className="text-green-600 font-medium flex items-start mb-1">
                                    <span className="mr-2">A:</span> 
                                    <span>{question.options[question.correctOptionIndex]}</span>
                                  </div>
                                  
                                  {question.explanation && (
                                    <div className="text-gray-600 text-sm mt-1">
                                      <span className="font-medium">Explanation:</span> {question.explanation}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex justify-between items-center mt-3">
                                  <div className="text-sm text-gray-500">
                                    Test {bookmark.testId}
                                  </div>
                                  <Link 
                                    href={`/subject/${bookmark.subjectId}/${bookmark.chapterId}/test/${bookmark.testId}`}
                                    className="flex items-center text-sm text-primary hover:underline"
                                  >
                                    Go to Test
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No bookmarks found</p>
                  <p className="mt-1">You haven't bookmarked any questions yet.</p>
                  <p className="mt-4">
                    Bookmark questions while reviewing your test results to save them for later revision.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
