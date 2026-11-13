// client/src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  // OPTIONAL: Hide Navbar on the Editor page to give more space to code
  // If you want the navbar visible everywhere, remove this block.
  if (location.pathname.startsWith("/edit") || location.pathname === "/create") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">⚡</span> CodeStash
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/discover" className="text-gray-300 hover:text-white transition-colors">Discover</Link>
            </div>
          </div>

          {/* Right Side: User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-400 text-sm hidden sm:block">Hi, {user.username}</span>
                <Link to="/create">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    + New Project
                  </button>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;