import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-heading font-bold mb-4">NEET Master</h3>
            <p className="text-gray-400 max-w-md">
              Your ultimate companion for NEET preparation. Access high-quality 
              study materials, take practice tests, and track your progress.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4">Subjects</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/subject/biology" className="text-gray-400 hover:text-white">
                    Biology
                  </Link>
                </li>
                <li>
                  <Link href="/subject/physics" className="text-gray-400 hover:text-white">
                    Physics
                  </Link>
                </li>
                <li>
                  <Link href="/subject/chemistry" className="text-gray-400 hover:text-white">
                    Chemistry
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/profile" className="text-gray-400 hover:text-white">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className="text-gray-400 hover:text-white">
                    My Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/bookmarks" className="text-gray-400 hover:text-white">
                    Bookmarks
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} NEET Master. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
