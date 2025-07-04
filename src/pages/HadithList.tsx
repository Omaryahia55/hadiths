import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortDesc, BookOpen, Star } from 'lucide-react';
import { hadiths, getCollections } from '../data/hadiths';
import HadithCard from '../components/HadithCard';

const HadithList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTheme, setFilterTheme] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'theme' | 'collection'>('id');

  const themes = [...new Set(hadiths.map(h => h.theme))];
  const collections = getCollections();
  const grades = [...new Set(hadiths.map(h => h.grade))];

  const filteredAndSortedHadiths = hadiths
    .filter(hadith => {
      const matchesSearch = searchTerm === '' || 
        hadith.arabicText.includes(searchTerm) ||
        hadith.translation.includes(searchTerm) ||
        hadith.narrator.includes(searchTerm) ||
        hadith.keywords.some(keyword => keyword.includes(searchTerm));
      
      const matchesTheme = filterTheme === '' || hadith.theme === filterTheme;
      const matchesCollection = filterCollection === '' || hadith.collection === filterCollection;
      const matchesGrade = filterGrade === '' || hadith.grade === filterGrade;
      
      return matchesSearch && matchesTheme && matchesCollection && matchesGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      if (sortBy === 'collection') return a.collection.localeCompare(b.collection, 'ar');
      return a.theme.localeCompare(b.theme, 'ar');
    });

  const handleHadithClick = (hadithId: number) => {
    navigate(`/hadith/${hadithId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTheme('');
    setFilterCollection('');
    setFilterGrade('');
    setSortBy('id');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center font-amiri flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-emerald-600 ml-3" />
          مكتبة الأحاديث النبوية الشريفة
        </h1>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {hadiths.length}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">إجمالي الأحاديث</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {collections.length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">المجموعات</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {themes.length}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">المواضيع</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hadiths.filter(h => h.grade === 'صحيح').length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">أحاديث صحيحة</div>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الأحاديث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">جميع المجموعات</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">جميع المواضيع</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">جميع الدرجات</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'id' | 'theme' | 'collection')}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="id">ترتيب حسب الرقم</option>
              <option value="collection">ترتيب حسب المجموعة</option>
              <option value="theme">ترتيب حسب الموضوع</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            عرض {filteredAndSortedHadiths.length} من {hadiths.length} حديث
          </div>
          
          {(searchTerm || filterTheme || filterCollection || filterGrade) && (
            <button
              onClick={clearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
            >
              مسح جميع المرشحات
            </button>
          )}
        </div>
      </div>

      {/* Collections Quick Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">تصفح حسب المجموعة</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCollection('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCollection === ''
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            جميع المجموعات
          </button>
          {collections.map(collection => (
            <button
              key={collection}
              onClick={() => setFilterCollection(collection)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCollection === collection
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {collection} ({hadiths.filter(h => h.collection === collection).length})
            </button>
          ))}
        </div>
      </div>

      {/* Hadith Cards */}
      <div className="grid gap-6">
        {filteredAndSortedHadiths.map(hadith => (
          <HadithCard
            key={hadith.id}
            hadith={hadith}
            onClick={() => handleHadithClick(hadith.id)}
          />
        ))}
      </div>

      {filteredAndSortedHadiths.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            جرب تغيير كلمات البحث أو إزالة المرشحات
          </p>
          <button
            onClick={clearFilters}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            مسح جميع المرشحات
          </button>
        </div>
      )}
    </div>
  );
};

export default HadithList;