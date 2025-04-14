import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { subjects } from "@/data/subjects";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
          Welcome to NEET Master
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your ultimate companion for NEET preparation. Choose a subject to get started.
        </p>
        {!user && (
          <div className="mt-6">
            <Link href="/auth">
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105"
          >
            <div 
              className={`h-32 ${
                subject.id === "biology" 
                  ? "bg-[#4CAF50]" 
                  : subject.id === "physics" 
                  ? "bg-[#2196F3]" 
                  : "bg-[#FF9800]"
              }`}
            />
            <div className="p-6">
              <h2 
                className={`text-2xl font-heading font-bold mb-2 ${
                  subject.id === "biology" 
                    ? "text-[#4CAF50]" 
                    : subject.id === "physics" 
                    ? "text-[#2196F3]" 
                    : "text-[#FF9800]"
                }`}
              >
                {subject.name}
              </h2>
              <p className="text-gray-600 mb-4">
                Master all concepts of {subject.name} for NEET
              </p>
              <Link 
                href={user ? `/subject/${subject.id}` : "/auth"}
                className={`
                  px-4 py-2 rounded-lg inline-block text-white hover:bg-opacity-90
                  ${
                    subject.id === "biology" 
                      ? "bg-[#4CAF50]" 
                      : subject.id === "physics" 
                      ? "bg-[#2196F3]" 
                      : "bg-[#FF9800]"
                  }
                `}
              >
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
