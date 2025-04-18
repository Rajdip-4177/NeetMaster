import { useState } from 'react';
import { useQuizHistory } from '@/hooks/use-quiz-history';
import { formatTime } from '@/utils/formatTime';
import { cn } from '@/utils/cn';

// Icons
import { 
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, 
  Award, BookOpen, Target, Activity, Users, Flame, BookOpenCheck
} from 'lucide-react';

const tabs = [
  { id: 'overview', name: 'Overview', icon: Activity },
  { id: 'weak-areas', name: 'Weak Areas', icon: AlertCircle },
  { id: 'suggestions', name: 'Suggestions', icon: BookOpen },
  { id: 'progress', name: 'Progress', icon: TrendingUp },
  { id: 'tests', name: 'Tests', icon: Target },
  { id: 'compete', name: 'Compete', icon: Users },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    quizHistory, 
    loading, 
    subjectPerformance, 
    weakChapters, 
    streak, 
    scoreOverTime,
    bestTest,
    worstTest
  } = useQuizHistory();
  
  // Calculate metrics
  const averageScore = quizHistory.length > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length) 
    : 0;
  
  const averageAccuracy = quizHistory.length > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.accuracy, 0) / quizHistory.length) 
    : 0;
  
  const averageTime = quizHistory.length > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.timeTaken, 0) / quizHistory.length) 
    : 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : quizHistory.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <BookOpenCheck className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">No Quiz Data Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Take some quizzes to see your performance statistics and get personalized insights!
                </p>
                <a 
                  href="/subject/physics" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Start a Quiz
                </a>
              </div>
            ) : (
              <>
                {/* Score Trend */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Score Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-500 px-4 py-8">
                      <Activity className="h-12 w-12 mx-auto mb-2 text-primary" />
                      {quizHistory.length > 0 ? (
                        <p>Your scores are improving over time!</p>
                      ) : (
                        <p>Take some quizzes to see your score trend here</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</h3>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">{averageScore}%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Across {quizHistory.length} tests</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Accuracy</h3>
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{averageAccuracy}%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Questions answered correctly</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Time</h3>
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">{formatTime(averageTime)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Per test</p>
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
                  <div className="space-y-4">
                    {subjectPerformance.map(subject => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{subject.name}</span>
                          <span>{subject.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${subject.score}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">{subject.testsCount} tests taken</p>
                      </div>
                    ))}
                    
                    {subjectPerformance.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <p>No subject data available yet. Take some quizzes!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Best and Worst Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bestTest && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Best Performance</h3>
                        <Award className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">{bestTest.subjectName}: {bestTest.chapterName}</p>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Score</span>
                          <span className="font-medium">{bestTest.score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Accuracy</span>
                          <span className="font-medium">{bestTest.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Time Taken</span>
                          <span className="font-medium">{formatTime(bestTest.timeTaken)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mt-2">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${bestTest.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {worstTest && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Needs Improvement</h3>
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">{worstTest.subjectName}: {worstTest.chapterName}</p>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Score</span>
                          <span className="font-medium">{worstTest.score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Accuracy</span>
                          <span className="font-medium">{worstTest.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Time Taken</span>
                          <span className="font-medium">{formatTime(worstTest.timeTaken)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mt-2">
                          <div 
                            className="h-2 bg-red-500 rounded-full" 
                            style={{ width: `${worstTest.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!bestTest && !worstTest && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow col-span-2">
                      <div className="text-center py-8">
                        <Award className="h-10 w-10 mx-auto mb-2 text-yellow-500" />
                        <h3 className="text-lg font-medium mb-1">No Performance Data Yet</h3>
                        <p className="text-gray-500">Complete some quizzes to see your best and worst performances</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Streak and Ranking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Study Streak</h3>
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-500">{streak.current} Days</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">Current Streak</p>
                      <p className="mt-4 text-sm">Longest streak: {streak.longest} days</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Keep practicing daily to build your streak!</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Your Ranking</h3>
                      <Award className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-500">-</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">Keep practicing to see your rank</p>
                      <div className="h-2 bg-gray-200 rounded-full mt-4">
                        <div 
                          className="h-2 bg-purple-500 rounded-full" 
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Based on test accuracy and completion</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'weak-areas':
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : quizHistory.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-medium mb-2">No Weak Areas Identified Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Complete some quizzes so we can analyze your performance and identify areas that need improvement.
                </p>
                <a 
                  href="/subject/physics" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Start a Quiz
                </a>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-4">Your Weak Areas</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Based on your past quiz attempts, we've identified these areas that need more attention
                  </p>

                  {weakChapters.length === 0 ? (
                    <div className="text-center py-10">
                      <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No weak areas identified yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Take more quizzes to help us identify your weak areas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {weakChapters.map((chapter) => (
                        <div 
                          key={chapter.id} 
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <span 
                                  className={cn(
                                    "w-3 h-3 rounded-full mr-2", 
                                    chapter.accuracy < 50 ? "bg-red-500" : "bg-yellow-500"
                                  )}
                                ></span>
                                <h4 className="font-medium">{chapter.name}</h4>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {chapter.subject} • Last attempted {chapter.lastAttempted}
                              </p>
                            </div>
                            <div className="mt-3 md:mt-0 flex items-center">
                              <span className="font-medium text-lg mr-3">
                                {chapter.accuracy}%
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Accuracy
                              </span>
                            </div>
                          </div>
                          
                          <div className="h-2 bg-gray-200 rounded-full mt-3">
                            <div 
                              className={cn(
                                "h-2 rounded-full", 
                                chapter.accuracy < 50 ? "bg-red-500" : "bg-yellow-500"
                              )}
                              style={{ width: `${chapter.accuracy}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex mt-4 space-x-2">
                            <a 
                              href={`/subject/${chapter.subjectId}/${chapter.id}`}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full"
                            >
                              Revise Chapter
                            </a>
                            <a
                              href={`/subject/${chapter.subjectId}/${chapter.id}`}
                              className="px-3 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded-full"
                            >
                              Practice Quiz
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Frequently Wrong Concepts</h3>
                    {weakChapters.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Take more quizzes to see frequently missed concepts
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {weakChapters.length > 0 && (
                          <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>{weakChapters[0].name} concepts</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">Review needed</span>
                          </div>
                        )}
                        {weakChapters.length > 1 && (
                          <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <span>{weakChapters[1].name} concepts</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">Review needed</span>
                          </div>
                        )}
                        {weakChapters.length > 2 && (
                          <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <span>{weakChapters[2].name} concepts</span>
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Needs practice</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Recommended Flashcards</h3>
                    {weakChapters.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Take more quizzes to get flashcard recommendations
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {weakChapters.length > 0 && (
                          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                            <p className="font-medium">Review key concepts in {weakChapters[0].name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {weakChapters[0].subject}
                            </p>
                          </div>
                        )}
                        {weakChapters.length > 1 && (
                          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                            <p className="font-medium">Study important formulas in {weakChapters[1].name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {weakChapters[1].subject}
                            </p>
                          </div>
                        )}
                        {weakChapters.length > 2 && (
                          <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                            <p className="font-medium">Review diagrams for {weakChapters[2].name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {weakChapters[2].subject}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'suggestions':
        return (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Smart Revision Suggestions</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              This feature is coming soon! We'll analyze your performance and suggest what to study next.
            </p>
          </div>
        );
      case 'progress':
        return (
          <div className="text-center py-20">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Progress Tracking</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              This feature is coming soon! Detailed insights into your learning journey and progress.
            </p>
          </div>
        );
      case 'tests':
        return (
          <div className="text-center py-20">
            <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Test History</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              This feature is coming soon! View all your past tests and performance details.
            </p>
          </div>
        );
      case 'compete':
        return (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Compete With Peers</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              This feature is coming soon! Challenge your friends and see who ranks highest!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your performance and get insights to improve
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div key={activeTab} className="transition-all duration-200 ease-in-out">
        {renderTabContent()}
      </div>
    </div>
  );
} 