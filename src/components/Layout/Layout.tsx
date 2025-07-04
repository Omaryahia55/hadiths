import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useSettings } from '../../context/SettingsContext';

const Layout: React.FC = () => {
  const { darkMode } = useSettings();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'dark bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-slate-50 to-emerald-50'
    }`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-emerald-800 dark:bg-emerald-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-amiri text-lg mb-2">الأربعون النووية</p>
          <p className="text-emerald-200 text-sm">
            منصة تعليمية لحفظ ودراسة الأحاديث النبوية الشريفة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;