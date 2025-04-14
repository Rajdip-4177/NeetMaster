import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SubjectPage from "@/pages/subject-page";
import ChapterPage from "@/pages/chapter-page";
import QuizPage from "@/pages/quiz-page";
import ResultsPage from "@/pages/results-page";
import ProfilePage from "@/pages/profile-page";
import TasksPage from "@/pages/tasks-page";
import BookmarksPage from "@/pages/bookmarks-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/subject/:subject" component={SubjectPage} />
          <ProtectedRoute path="/subject/:subject/:chapter" component={ChapterPage} />
          <ProtectedRoute path="/subject/:subject/:chapter/test/:testId" component={QuizPage} />
          <ProtectedRoute path="/subject/:subject/:chapter/test/:testId/results" component={ResultsPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/tasks" component={TasksPage} />
          <ProtectedRoute path="/bookmarks" component={BookmarksPage} />
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
