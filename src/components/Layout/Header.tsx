import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Heart, Target, Star, Settings, Menu, X, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/hadiths', icon: BookOpen, label: 'الأحاديث' },
    { path: '/favorites', icon: Heart, label: 'المفضلة' },
    { path: '/exercises', icon: Target, label: 'التمارين' },
    { path: '/contact', icon: MessageCircle, label: 'تواصل معنا' },
    { path: '/settings', icon: Settings, label: 'الإعدادات' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-emerald-800 to-emerald-700 dark:from-emerald-900 dark:to-emerald-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-amiri">مكتبة الأحاديث</span>
          </Link>

          {/* Navigation Menu for both Desktop and Mobile */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 space-x-reverse text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="hidden sm:inline">القائمة</span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                  {/* User Info Section */}
                  {user ? (
                    <div className="bg-emerald-50 dark:bg-emerald-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="bg-emerald-600 p-2 rounded-full">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                            {user.name}
                          </p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-300">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex space-x-2 space-x-reverse">
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 bg-emerald-600 text-white text-center py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          إنشاء حساب
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="py-2">
                    {navItems.map(({ path, icon: Icon, label }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 space-x-reverse px-4 py-3 transition-colors ${
                          location.pathname === path
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    ))}
                    
                    {/* Logout Button */}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">تسجيل الخروج</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;