import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SubjectPage from "@/pages/subject-page";
import ChapterPage from "@/pages/chapter-page";
import QuizPage from "@/pages/quiz-page";
import QuizResultPage from "@/pages/quiz-result-page";
import TasksPage from "@/pages/tasks-page";
import ProfilePage from "@/pages/profile-page";

import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/biology" component={() => <SubjectPage subject="biology" />} />
          <ProtectedRoute path="/physics" component={() => <SubjectPage subject="physics" />} />
          <ProtectedRoute path="/chemistry" component={() => <SubjectPage subject="chemistry" />} />
          <ProtectedRoute path="/:subject/:chapter" component={ChapterPage} />
          <ProtectedRoute path="/:subject/:chapter/test/:testId" component={QuizPage} />
          <ProtectedRoute path="/:subject/:chapter/test/:testId/result" component={QuizResultPage} />
          <ProtectedRoute path="/tasks" component={TasksPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
