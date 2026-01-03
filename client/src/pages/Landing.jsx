import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaShieldAlt, FaMobileAlt, FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { SiExpress } from 'react-icons/si';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-block mb-6">
            <FaRocket className="text-6xl text-primary-600 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text animate-pulse">
              MERN Hackathon
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            A complete, production-ready boilerplate for your next hackathon project.
            Built with <span className="font-semibold text-primary-600">React</span>, <span className="font-semibold text-green-600">Node.js</span>, <span className="font-semibold text-blue-600">Express</span>, and <span className="font-semibold text-green-700">MongoDB</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaRocket />
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-50 text-primary-600 px-10 py-5 rounded-xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-primary-600 transform hover:scale-105"
                >
                  Login →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast Setup
            </h3>
            <p className="text-gray-600">
              Pre-configured authentication, routing, and state management.
              Start building your idea immediately.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure by Default
            </h3>
            <p className="text-gray-600">
              JWT authentication, password hashing with bcrypt, and protected
              routes out of the box.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-primary-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Modern UI
            </h3>
            <p className="text-gray-600">
              Beautiful, responsive design with Tailwind CSS. Impress the
              judges with a professional look.
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-24 bg-white p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Built With Modern Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">⚛️</div>
              <p className="font-semibold">React</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🟢</div>
              <p className="font-semibold">Node.js</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🚂</div>
              <p className="font-semibold">Express</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🍃</div>
              <p className="font-semibold">MongoDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
