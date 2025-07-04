import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Type, Volume2, Eye, Info } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Settings: React.FC = () => {
  const {
    darkMode,
    fontSize,
    autoPlay,
    showTranslation,
    toggleDarkMode,
    setFontSize,
    setAutoPlay,
    setShowTranslation,
  } = useSettings();

  const fontSizeOptions = [
    { value: 'small', label: 'صغير', size: 'text-sm' },
    { value: 'medium', label: 'متوسط', size: 'text-base' },
    { value: 'large', label: 'كبير', size: 'text-lg' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center font-amiri flex items-center justify-center">
          <SettingsIcon className="h-8 w-8 text-blue-600 ml-3" />
          الإعدادات
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          خصص تجربتك في تعلم الأحاديث النبوية الشريفة
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Eye className="h-5 w-5 ml-2 text-emerald-600" />
            إعدادات المظهر
          </h2>
          
          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-blue-600" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    الوضع المظلم
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    تفعيل الوضع المظلم لراحة العينين
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                <Type className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  حجم الخط
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFontSize(option.value as any)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      fontSize === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className={`${option.size} font-amiri text-gray-800 dark:text-white`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Volume2 className="h-5 w-5 ml-2 text-blue-600" />
            إعدادات القراءة
          </h2>
          
          <div className="space-y-4">
            {/* Auto Translation */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  إظهار المعنى تلقائياً
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  عرض ترجمة الأحاديث بشكل افتراضي
                </p>
              </div>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showTranslation ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showTranslation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  التشغيل التلقائي للصوت
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  تشغيل تلاوة الحديث تلقائياً عند فتحه
                </p>
              </div>
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoPlay ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoPlay ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Info className="h-5 w-5 ml-2 text-amber-600" />
            حول التطبيق
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900 dark:to-blue-900 rounded-lg">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                الأربعون النووية
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                منصة تفاعلية لحفظ ودراسة الأحاديث النبوية الشريفة من مجموعة الإمام النووي رحمه الله.
                تم تصميم هذا التطبيق لمساعدة المسلمين على حفظ ومراجعة هذه الأحاديث المباركة بطريقة سهلة وممتعة.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">40</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">حديث نبوي</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-1">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">أنواع تمارين</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;