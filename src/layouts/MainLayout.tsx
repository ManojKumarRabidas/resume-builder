import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FilePlus, FileText, Home, LogOut, Menu, User, X, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/resumes', label: 'My Resumes', icon: <FileText className="h-5 w-5" /> },
    { path: '/templates', label: 'Templates', icon: <Briefcase className="h-5 w-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  const renderNavigationItems = () => {
    return navigationItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => `
          flex items-center p-3 rounded-md text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-blue-100 text-blue-800' 
            : 'text-gray-700 hover:bg-gray-100'
          }
        `}
        end={item.path === '/'}
      >
        <span className="mr-3">{item.icon}</span>
        {item.label}
      </NavLink>
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">ResumeBuilder</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="p-4 space-y-1">
            {renderNavigationItems()}
            
            <div className="mt-6">
              <Button
                variant="primary"
                leftIcon={<FilePlus className="h-5 w-5" />}
                fullWidth
                // onClick={() => navigate('/resumes/create')}
                onClick={() => navigate('/templates')}
              >
                Create Resume
              </Button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              leftIcon={<LogOut className="h-5 w-5" />}
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header and menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-blue-600">ResumeBuilder</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`
          md:hidden fixed inset-y-0 left-0 w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">ResumeBuilder</h1>
        </div>
        
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="p-4 space-y-1">
            {renderNavigationItems()}
            
            <div className="mt-6">
              <Button
                variant="primary"
                leftIcon={<FilePlus className="h-5 w-5" />}
                fullWidth
                onClick={() => { navigate('/templates'); setIsMobileMenuOpen(false); }}
                // onClick={() => { navigate('/resumes/create'); setIsMobileMenuOpen(false); }}
              >
                Create Resume
              </Button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              leftIcon={<LogOut className="h-5 w-5" />}
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 lg:ml-72 pt-16 md:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;