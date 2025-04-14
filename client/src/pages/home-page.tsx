import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { subjects } from "@/data/subjects";
import { FaFlask, FaDna, FaAtom, FaBook, FaTasks, FaQuestionCircle, FaChalkboardTeacher, FaChartLine, FaRegCheckCircle, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
        return <FaDna className="h-14 w-14" />;
      case "physics":
        return <FaAtom className="h-14 w-14" />;
      case "chemistry":
        return <FaFlask className="h-14 w-14" />;
      default:
        return <FaBook className="h-14 w-14" />;
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      className="min-h-screen"
    >
      {/* Hero Section with Blob Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-10 pb-16 md:pb-20">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl opacity-70"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg">
                <FaChalkboardTeacher className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
              variants={fadeInUp}
            >
              NEET Master
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Your comprehensive companion for NEET exam preparation. Access study materials, interactive quizzes, and personalized tracking all in one place.
            </motion.p>

            {!user && (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeInUp}
              >
                <Link href="/auth">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </Link>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 font-medium px-8 py-3 rounded-full transition-all duration-300 text-lg"
                >
                  Learn More
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <FaBook />, count: "10k+", label: "Questions" },
              { icon: <FaChartLine />, count: "100+", label: "Tests" },
              { icon: <FaRegCheckCircle />, count: "500+", label: "Concepts" },
              { icon: <FaAward />, count: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-center text-primary mb-2 text-2xl">
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{stat.count}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subject Cards Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose Your Subject
        </motion.h2>
        <motion.p 
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Select a subject to access chapter-wise study material, interactive quizzes, and practice tests
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subjects.map((subject) => {
            // Set color scheme based on subject
            const colorScheme = {
              biology: {
                gradient: "from-green-400 to-green-600",
                hoverGradient: "from-green-500 to-green-700",
                light: "bg-green-50",
                border: "border-green-200",
                text: "text-green-700",
                button: "bg-green-600 hover:bg-green-700",
                icon: "text-green-500"
              },
              physics: {
                gradient: "from-blue-400 to-blue-600",
                hoverGradient: "from-blue-500 to-blue-700",
                light: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-700",
                button: "bg-blue-600 hover:bg-blue-700",
                icon: "text-blue-500"
              },
              chemistry: {
                gradient: "from-orange-400 to-orange-600",
                hoverGradient: "from-orange-500 to-orange-700",
                light: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-700",
                button: "bg-orange-600 hover:bg-orange-700",
                icon: "text-orange-500"
              }
            };
            
            const colors = colorScheme[subject.id as keyof typeof colorScheme];
            
            return (
              <motion.div 
                key={subject.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl ${colors.border}`}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div 
                  className={`h-52 flex items-center justify-center bg-gradient-to-r ${colors.gradient} group-hover:bg-gradient-to-r group-hover:${colors.hoverGradient} transition-all duration-500 relative overflow-hidden`}
                >
                  {/* Animated circles in background */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
                    <div className="absolute top-20 right-10 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 left-20 w-32 h-32 bg-white rounded-full"></div>
                  </div>
                  
                  <motion.div 
                    className="text-white text-center z-10"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getSubjectIcon(subject.id)}
                    <h3 className="text-2xl font-bold mt-4 drop-shadow-md">{subject.name}</h3>
                  </motion.div>
                </div>
                
                <div className={`p-6 ${colors.light} h-full flex flex-col`}>
                  <h2 className={`text-2xl font-heading font-bold mb-3 ${colors.text}`}>
                    12+ Chapters
                  </h2>
                  <p className="text-gray-700 mb-6 flex-grow">
                    Complete {subject.name.toLowerCase()} curriculum for NEET with comprehensive notes, NCERT solutions, and topic-wise questions.
                  </p>
                  <Link 
                    href={user ? `/subject/${subject.id}` : "/auth"}
                    className={`px-6 py-3 rounded-xl inline-block text-white font-medium text-center ${colors.button} shadow-md hover:shadow-lg transition-all duration-300 w-full`}
                  >
                    Explore {subject.name}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose NEET Master?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to provide you with all the tools you need to excel in your NEET preparation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <FaBook className="h-8 w-8 text-blue-600" />,
                color: "blue",
                title: "Comprehensive Study Material",
                description: "Access detailed notes, NCERT solutions, and study guides for all subjects. Our content is prepared by expert educators.",
              },
              {
                icon: <FaQuestionCircle className="h-8 w-8 text-green-600" />,
                color: "green",
                title: "Interactive Practice Tests",
                description: "Test your knowledge with our adaptive quizzes. Get instant feedback and detailed explanations for each question.",
              },
              {
                icon: <FaTasks className="h-8 w-8 text-orange-600" />,
                color: "orange",
                title: "Personal Progress Tracking",
                description: "Organize your study schedule, track your progress, and identify improvement areas with our analytics dashboard.",
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`${feature.color === "blue" ? "bg-blue-100" : feature.color === "green" ? "bg-green-100" : "bg-orange-100"} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4 py-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/90 to-blue-600/90 rounded-3xl p-10 shadow-xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your NEET Preparation?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of students who have successfully cleared NEET with our comprehensive preparation platform.
          </p>
          
          {!user && (
            <Link href="/auth">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-3 rounded-xl shadow-lg text-lg"
              >
                Start Learning Today
              </Button>
            </Link>
          )}
          
          {user && (
            <div className="flex justify-center gap-4 flex-wrap">
              {subjects.map(subject => (
                <Link 
                  key={subject.id}
                  href={`/subject/${subject.id}`}
                >
                  <Button 
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 font-medium px-6 py-3 rounded-xl shadow-lg"
                  >
                    {subject.name} Materials
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
