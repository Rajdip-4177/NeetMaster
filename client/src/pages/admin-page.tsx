import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertCircle, BarChart3, Check, CheckSquare, ChevronLeft, ChevronRight, 
  Edit, Eye, FileText, ListFilter, PlusCircle, Search, ShieldAlert, 
  Trash, User, Users 
} from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { subjects } from "@/data/subjects";
import { chapters } from "@/data/chapters";

// Types
interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: string;
  phone?: string;
  class?: string;
}

interface QuizAttempt {
  id: number;
  userId: number;
  subjectId: string;
  chapterId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeTaken: number;
  createdAt: string;
}

interface AnalyticsData {
  userCount: number;
  quizAttemptCount: number;
  taskCount: number;
  recentQuizAttempts: QuizAttempt[];
}

// New types for questions management
interface Question {
  id: number;
  subjectId: string;
  chapterId: string;
  testId: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

interface NewQuestionFormData {
  subjectId: string;
  chapterId: string;
  testId: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

function DashboardTab() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData, Error>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/analytics");
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading dashboard data...</div>;
  }

  if (!analytics) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load analytics data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.userCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.quizAttemptCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.taskCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Attempts</CardTitle>
          <CardDescription>
            The most recent student quiz attempts across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.recentQuizAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.userId}</TableCell>
                  <TableCell className="capitalize">{attempt.subjectId}</TableCell>
                  <TableCell>{attempt.score} / {attempt.totalQuestions * 4}</TableCell>
                  <TableCell>{new Date(attempt.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { toast } = useToast();

  const { 
    data: users = [], 
    isLoading,
    refetch 
  } = useQuery<AdminUser[], Error>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/users");
      return res.json();
    }
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle admin status mutation
  const toggleAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/toggle-admin`);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Admin ${data.isAdmin ? "Enabled" : "Disabled"}`,
        description: `Admin privileges ${data.isAdmin ? "granted to" : "revoked from"} ${data.firstName} ${data.lastName}`,
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update admin status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (user: { id: number, data: Partial<AdminUser> }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${user.id}`, user.data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "The user details have been successfully updated",
      });
      refetch();
      setEditUserDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({ ...user });
    setEditUserDialogOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const { id, ...data } = editingUser;
      updateUserMutation.mutate({ id, data });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <div className="w-1/3">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.class || "N/A"}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.isAdmin}
                      onCheckedChange={() => toggleAdminMutation.mutate(user.id)}
                      disabled={toggleAdminMutation.isPending}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
                            deleteUserMutation.mutate(user.id);
                          }
                        }}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editingUser?.firstName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser!, firstName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editingUser?.lastName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser!, lastName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser?.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser!, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editingUser?.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser!, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class
                </Label>
                <Input
                  id="class"
                  value={editingUser?.class || ""}
                  onChange={(e) => setEditingUser({ ...editingUser!, class: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddQuestionTab() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewQuestionFormData>({
    subjectId: "",
    chapterId: "",
    testId: 1,
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    explanation: ""
  });
  
  // Filter chapters based on selected subject
  const filteredChapters = chapters.filter(
    chapter => chapter.subjectId === formData.subjectId
  );
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };
  
  // Handle dropdown selections
  const handleSelectChange = (name: string, value: string) => {
    // Reset chapterId if subject changes
    if (name === "subjectId") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        chapterId: "" // Reset chapter when subject changes
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle correct option selection
  const handleCorrectOptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, correctOptionIndex: parseInt(value) }));
  };
  
  // Add question mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (questionData: NewQuestionFormData) => {
      const res = await apiRequest("POST", "/api/admin/questions", questionData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Question added",
        description: "The question has been successfully added to the database",
      });
      // Reset form
      setFormData({
        subjectId: formData.subjectId, // Keep the last selected subject for convenience
        chapterId: formData.chapterId, // Keep the last selected chapter for convenience
        testId: formData.testId, // Keep the last test ID for convenience
        questionText: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: ""
      });
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add question",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.subjectId) {
      toast({
        title: "Validation Error",
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.chapterId) {
      toast({
        title: "Validation Error",
        description: "Please select a chapter",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.questionText.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all options have content
    const emptyOptions = formData.options.filter(option => !option.trim());
    if (emptyOptions.length > 0) {
      toast({
        title: "Validation Error",
        description: "All options must have content",
        variant: "destructive",
      });
      return;
    }
    
    // Submit the form
    addQuestionMutation.mutate(formData);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Add New Question</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Question</CardTitle>
          <CardDescription>
            Add a new multiple-choice question to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subjectId">Subject *</Label>
                  <Select 
                    value={formData.subjectId} 
                    onValueChange={(value) => handleSelectChange("subjectId", value)}
                  >
                    <SelectTrigger id="subjectId">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="chapterId">Chapter *</Label>
                  <Select 
                    value={formData.chapterId} 
                    onValueChange={(value) => handleSelectChange("chapterId", value)}
                    disabled={!formData.subjectId}
                  >
                    <SelectTrigger id="chapterId">
                      <SelectValue placeholder={formData.subjectId ? "Select chapter" : "Select subject first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredChapters.map(chapter => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="testId">Test ID *</Label>
                  <Input
                    id="testId"
                    name="testId"
                    type="number"
                    min="1"
                    value={formData.testId}
                    onChange={handleInputChange}
                    placeholder="Enter test ID (e.g., 1 for Test 1)"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="questionText">Question Text *</Label>
                <Textarea
                  id="questionText"
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleInputChange}
                  placeholder="Enter the question text"
                  className="h-[142px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Options *</Label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <RadioGroup 
                      value={formData.correctOptionIndex.toString()} 
                      onValueChange={handleCorrectOptionChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="font-normal">
                          {String.fromCharCode(65 + index)}
                        </Label>
                      </div>
                    </RadioGroup>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                placeholder="Provide an explanation for the correct answer"
                className="h-24"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={addQuestionMutation.isPending}
              >
                <PlusCircle className="h-4 w-4" />
                {addQuestionMutation.isPending ? "Adding Question..." : "Add Question"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ViewQuestionsTab() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [chapterFilter, setChapterFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const itemsPerPage = 10;

  // Get questions data
  const { 
    data: questions = [], 
    isLoading,
    refetch 
  } = useQuery<Question[], Error>({
    queryKey: ["/api/admin/questions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/questions");
      return res.json();
    }
  });
  
  // Filter chapters based on selected subject for the filter
  const filteredChaptersForFilter = chapters.filter(
    chapter => !subjectFilter || chapter.subjectId === subjectFilter
  );
  
  // Filter questions based on filters and search term
  const filteredQuestions = questions.filter(question => {
    // Apply subject filter
    if (subjectFilter && question.subjectId !== subjectFilter) return false;
    
    // Apply chapter filter
    if (chapterFilter && question.chapterId !== chapterFilter) return false;
    
    // Apply search term to question text
    if (searchTerm && !question.questionText.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: number) => {
      await apiRequest("DELETE", `/api/admin/questions/${questionId}`);
    },
    onSuccess: () => {
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete question",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async (data: { id: number, questionData: Partial<Question> }) => {
      const res = await apiRequest("PUT", `/api/admin/questions/${data.id}`, data.questionData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Question updated",
        description: "The question has been successfully updated",
      });
      refetch();
      setEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update question",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle edit question
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setEditDialogOpen(true);
  };
  
  // Handle option change in edit mode
  const handleEditOptionChange = (index: number, value: string) => {
    if (!editingQuestion) return;
    
    const newOptions = [...editingQuestion.options];
    newOptions[index] = value;
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };
  
  // Handle update question
  const handleUpdateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    
    const { id, ...questionData } = editingQuestion;
    updateQuestionMutation.mutate({ id, questionData });
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-12">Loading questions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Manage Questions</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-48">
            <Select 
              value={subjectFilter} 
              onValueChange={(value) => {
                setSubjectFilter(value);
                setChapterFilter(""); // Reset chapter filter when subject changes
                setCurrentPage(1); // Reset pagination
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 md:w-48">
            <Select 
              value={chapterFilter} 
              onValueChange={(value) => {
                setChapterFilter(value);
                setCurrentPage(1); // Reset pagination
              }}
              disabled={!subjectFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder={subjectFilter ? "Filter by chapter" : "Select subject first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Chapters</SelectItem>
                {filteredChaptersForFilter.map(chapter => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 md:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset pagination on search
              }}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead className="w-1/3">Question</TableHead>
                <TableHead>Test ID</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuestions.length > 0 ? (
                paginatedQuestions.map((question) => {
                  // Find subject and chapter names
                  const subject = subjects.find(s => s.id === question.subjectId);
                  const chapter = chapters.find(c => c.id === question.chapterId);
                  
                  return (
                    <TableRow key={question.id}>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>{subject?.name || question.subjectId}</TableCell>
                      <TableCell>
                        {chapter?.name || question.chapterId.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {question.questionText.length > 100 
                          ? `${question.questionText.substring(0, 100)}...` 
                          : question.questionText}
                      </TableCell>
                      <TableCell>{question.testId}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete this question?`)) {
                                deleteQuestionMutation.mutate(question.id);
                              }
                            }}
                            disabled={deleteQuestionMutation.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {filteredQuestions.length === 0 && questions.length > 0 ? (
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 mb-2 text-gray-400" />
                        <p>No questions match your search criteria</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2 text-gray-400" />
                        <p>No questions found in the database</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update the question details and click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <form onSubmit={handleUpdateQuestion}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-subject">Subject</Label>
                    <Select 
                      value={editingQuestion.subjectId} 
                      onValueChange={(value) => setEditingQuestion({ ...editingQuestion, subjectId: value })}
                    >
                      <SelectTrigger id="edit-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-chapter">Chapter</Label>
                    <Select 
                      value={editingQuestion.chapterId} 
                      onValueChange={(value) => setEditingQuestion({ ...editingQuestion, chapterId: value })}
                    >
                      <SelectTrigger id="edit-chapter">
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters
                          .filter(chapter => chapter.subjectId === editingQuestion.subjectId)
                          .map(chapter => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-testId">Test ID</Label>
                  <Input
                    id="edit-testId"
                    type="number"
                    min="1"
                    value={editingQuestion.testId}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, testId: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-questionText">Question Text</Label>
                  <Textarea
                    id="edit-questionText"
                    value={editingQuestion.questionText}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                    className="h-24"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Options</Label>
                  <div className="space-y-3">
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <RadioGroup 
                          value={editingQuestion.correctOptionIndex.toString()} 
                          onValueChange={(value) => setEditingQuestion({ 
                            ...editingQuestion, 
                            correctOptionIndex: parseInt(value) 
                          })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`edit-option-${index}`} />
                            <Label htmlFor={`edit-option-${index}`} className="font-normal">
                              {String.fromCharCode(65 + index)}
                            </Label>
                          </div>
                        </RadioGroup>
                        <Input
                          value={option}
                          onChange={(e) => handleEditOptionChange(index, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="edit-explanation"
                    value={editingQuestion.explanation || ""}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    className="h-24"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={updateQuestionMutation.isPending}
                >
                  {updateQuestionMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuizAttemptsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: attempts = [], isLoading } = useQuery<QuizAttempt[], Error>({
    queryKey: ["/api/admin/quiz-attempts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/analytics");
      const data = await res.json();
      return data.recentQuizAttempts || [];
    }
  });

  // Filter attempts based on search term
  const filteredAttempts = attempts.filter(attempt => 
    attempt.userId.toString().includes(searchTerm) ||
    attempt.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attempt.chapterId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const paginatedAttempts = filteredAttempts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading quiz attempts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quiz Attempts</h2>
        <div className="w-1/3">
          <Input
            placeholder="Search attempts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Incorrect</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAttempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.id}</TableCell>
                  <TableCell>{attempt.userId}</TableCell>
                  <TableCell className="capitalize">{attempt.subjectId}</TableCell>
                  <TableCell>
                    {attempt.chapterId.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </TableCell>
                  <TableCell>{attempt.score} / {attempt.totalQuestions * 4}</TableCell>
                  <TableCell>{attempt.correctAnswers}</TableCell>
                  <TableCell>{attempt.incorrectAnswers}</TableCell>
                  <TableCell>{Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}</TableCell>
                  <TableCell>{new Date(attempt.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your site's users, content, and analytics
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4" /> Back to Site
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="add-question" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add Question
          </TabsTrigger>
          <TabsTrigger value="view-questions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Questions
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" /> Quiz Attempts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>
        
        <TabsContent value="add-question">
          <AddQuestionTab />
        </TabsContent>
        
        <TabsContent value="view-questions">
          <ViewQuestionsTab />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="quizzes">
          <QuizAttemptsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
} 