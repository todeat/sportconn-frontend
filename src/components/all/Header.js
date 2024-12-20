import { useSelector } from "react-redux";
import MobileMenu from "./MobileMenu";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
  
    return (
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <span className="text-2xl font-bold text-primary">
                Sport<span className="text-primary-200">Connect</span>
              </span>
            </div>
  
            {/* Navigation - Adjusted spacing and hover states */}
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Acasă
              </button>
              <button
                onClick={() => navigate('/facilities')}
                className="text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Baze Sportive
              </button>
              {user ? (
                <>
                  {/* <button
                    onClick={() => navigate('/dashboard')}
                    className="text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button> */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Profil
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Conectare
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary-100 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ml-2"
                  >
                    Înregistrare
                  </button>
                </>
              )}
            </nav>
  
            <MobileMenu />
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;