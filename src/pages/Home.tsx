import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Heart, TrendingUp, Award, Calendar, Star, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { hadiths, getCollections } from '../data/hadiths';
import ProgressRing from '../components/ProgressRing';

const Home: React.FC = () => {
  const { userData } = useUser();
  const { user } = useAuth();
  
  const totalHadiths = hadiths.length;
  const memorizedCount = userData.progress.filter(p => p.memorized).length;
  const progressPercentage = (memorizedCount / totalHadiths) * 100;
  const averageAccuracy = userData.progress.length > 0 
    ? userData.progress.reduce((acc, curr) => acc + curr.accuracy, 0) / userData.progress.length 
    : 0;

  const collections = getCollections();
  const sahihCount = hadiths.filter(h => h.grade === 'صحيح').length;

  const stats = [
    { label: 'الأحاديث المحفوظة', value: memorizedCount, total: totalHadiths, icon: BookOpen, color: 'text-emerald-600' },
    { label: 'المفضلة', value: userData.favorites.length, icon: Heart, color: 'text-red-500' },
    { label: 'النقاط الإجمالية', value: userData.totalScore, icon: Award, color: 'text-amber-500' },
    { label: 'متتالية الأيام', value: userData.streak, icon: TrendingUp, color: 'text-blue-500' },
  ];

  const quickActions = [
    {
      title: 'بدء الدراسة',
      description: 'ابدأ في قراءة وحفظ الأحاديث',
      icon: BookOpen,
      link: '/hadiths',
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      title: 'تمارين الحفظ',
      description: 'اختبر حفظك للأحاديث',
      icon: Target,
      link: '/exercises',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'الأحاديث المفضلة',
      description: 'راجع أحاديثك المفضلة',
      icon: Heart,
      link: '/favorites',
      color: 'bg-red-500 hover:bg-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold font-amiri mb-4">
          مكتبة الأحاديث النبوية الشريفة
        </h1>
        <p className="text-lg md:text-xl text-emerald-100 mb-6 max-w-3xl mx-auto leading-relaxed">
          منصة شاملة لحفظ ودراسة الأحاديث النبوية الشريفة من مختلف المجموعات والمصادر الموثوقة
        </p>
        
        {user && (
          <>
            <div className="flex justify-center mb-4">
              <ProgressRing
                progress={progressPercentage}
                size={120}
                strokeWidth={8}
                color="#fbbf24"
                backgroundColor="rgba(255,255,255,0.2)"
              />
            </div>
            <p className="text-emerald-100">
              تقدمك في الحفظ: {memorizedCount} من {totalHadiths} حديث
            </p>
          </>
        )}
        
        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/register"
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              إنشاء حساب جديد
            </Link>
            <Link
              to="/login"
              className="bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-800 transition-colors font-semibold"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>

      {/* Library Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {totalHadiths}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">إجمالي الأحاديث</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-3 text-blue-600" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {collections.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">المجموعات</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <Star className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {sahihCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">أحاديث صحيحة</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <Award className="h-8 w-8 mx-auto mb-3 text-amber-600" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {hadiths.filter(h => h.collection === 'الأربعون النووية').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">الأربعون النووية</div>
        </div>
      </div>

      {/* User Statistics (only if logged in) */}
      {user && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stat.total ? `${stat.value}/${stat.total}` : stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`${action.color} text-white rounded-xl p-6 text-center transition-all transform hover:scale-105 shadow-lg`}
          >
            <action.icon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{action.title}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Collections Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          المجموعات المتاحة
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection, index) => {
            const collectionCount = hadiths.filter(h => h.collection === collection).length;
            const collectionColors = [
              'border-emerald-400 bg-emerald-50 dark:bg-emerald-900',
              'border-blue-400 bg-blue-50 dark:bg-blue-900',
              'border-purple-400 bg-purple-50 dark:bg-purple-900',
              'border-amber-400 bg-amber-50 dark:bg-amber-900',
              'border-rose-400 bg-rose-50 dark:bg-rose-900',
              'border-indigo-400 bg-indigo-50 dark:bg-indigo-900',
            ];
            const colorClass = collectionColors[index % collectionColors.length];
            
            return (
              <Link
                key={collection}
                to={`/hadiths?collection=${encodeURIComponent(collection)}`}
                className={`border-r-4 ${colorClass} p-4 rounded-lg hover:shadow-md transition-shadow`}
              >
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {collection}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {collectionCount} حديث
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 ml-2 text-emerald-600" />
            {user ? 'آخر نشاط' : 'ابدأ رحلتك'}
          </h3>
          {user && userData.lastStudyDate ? (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                آخر مراجعة: {new Date(userData.lastStudyDate).toLocaleDateString('ar-SA')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                متوسط الدقة: {Math.round(averageAccuracy)}%
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900 border-r-4 border-emerald-400 p-4 rounded">
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  ممتاز! استمر في المراجعة اليومية لتحافظ على مستوى الحفظ
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user ? 'لم تبدأ رحلة التعلم بعد' : 'انضم إلينا وابدأ رحلة حفظ الأحاديث'}
              </p>
              <Link 
                to={user ? "/hadiths" : "/register"}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold"
              >
                {user ? 'ابدأ الآن' : 'إنشاء حساب'}
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Award className="h-5 w-5 ml-2 text-amber-500" />
            نصائح للحفظ
          </h3>
          <div className="space-y-4">
            <div className="border-r-4 border-amber-400 bg-amber-50 dark:bg-amber-900 p-4 rounded">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">التكرار المتباعد</h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                راجع الأحاديث في فترات متزايدة لتثبيت الحفظ
              </p>
            </div>
            <div className="border-r-4 border-blue-400 bg-blue-50 dark:bg-blue-900 p-4 rounded">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">الفهم قبل الحفظ</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                اقرأ شرح الحديث أولاً لتسهيل عملية الحفظ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;