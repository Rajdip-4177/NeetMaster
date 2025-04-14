import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { subjects } from "@/data/subjects";
import { FaFlask, FaDna, FaAtom, FaGraduationCap, FaBook, FaTasks, FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getSubjectIcon = (subjectId: string) => {
    switch (subjectId) {
      case "biology":
        return <FaDna className="h-12 w-12 mb-2" />;
      case "physics":
        return <FaAtom className="h-12 w-12 mb-2" />;
      case "chemistry":
        return <FaFlask className="h-12 w-12 mb-2" />;
      default:
        return <FaBook className="h-12 w-12 mb-2" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
          Welcome to NEET Master
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your ultimate companion for NEET preparation. Choose a subject to get started.
        </p>
        {!user && (
          <div className="mt-6">
            <Link href="/auth">
              <motion.button 
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Main subject cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {subjects.map((subject) => (
          <motion.div 
            key={subject.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
          >
            <div 
              className={`h-40 flex items-center justify-center ${
                subject.id === "biology" 
                  ? "bg-gradient-to-r from-green-500 to-green-600" 
                  : subject.id === "physics" 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                  : "bg-gradient-to-r from-orange-500 to-orange-600"
              }`}
            >
              <div className="text-white text-center">
                {getSubjectIcon(subject.id)}
                <h3 className="text-xl font-medium">{subject.name}</h3>
              </div>
            </div>
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
                Master all concepts of {subject.name} for NEET with comprehensive study materials and practice tests.
              </p>
              <Link 
                href={user ? `/subject/${subject.id}` : "/auth"}
                className={`
                  px-4 py-2 rounded-lg inline-block text-white hover:bg-opacity-90 transition-all
                  ${
                    subject.id === "biology" 
                      ? "bg-[#4CAF50] hover:bg-[#43A047]" 
                      : subject.id === "physics" 
                      ? "bg-[#2196F3] hover:bg-[#1E88E5]" 
                      : "bg-[#FF9800] hover:bg-[#FB8C00]"
                  }
                `}
              >
                Start Learning
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features section */}
      <motion.div 
        className="py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-3xl font-heading font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Study Material</h3>
            <p className="text-gray-600">Access detailed notes, NCERT solutions, and study guides for all subjects.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaQuestionCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with subject-wise quizzes and get instant feedback.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTasks className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Task Management</h3>
            <p className="text-gray-600">Organize your study schedule and track your progress with our task management system.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
