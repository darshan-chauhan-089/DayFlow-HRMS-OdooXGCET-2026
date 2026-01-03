const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-primary-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <div>
              <p className="text-sm font-semibold">
                © {new Date().getFullYear()} MERN Hackathon Boilerplate
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Built with ❤️ for developers
              </p>
            </div>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 transform flex items-center gap-2"
            >
              <span>💻</span>
              GitHub
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 transform flex items-center gap-2"
            >
              <span>📚</span>
              Docs
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-all duration-200 hover:scale-110 transform flex items-center gap-2"
            >
              <span>📧</span>
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
