import React from 'react';
import { Heart, BookOpen, Eye, Star, Award } from 'lucide-react';
import { Hadith } from '../data/hadiths';
import { useUser } from '../context/UserContext';

interface HadithCardProps {
  hadith: Hadith;
  showFullText?: boolean;
  onClick?: () => void;
}

const HadithCard: React.FC<HadithCardProps> = ({ 
  hadith, 
  showFullText = false, 
  onClick 
}) => {
  const { userData, toggleFavorite, getUserProgress } = useUser();
  const isFavorite = userData.favorites.includes(hadith.id);
  const progress = getUserProgress(hadith.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(hadith.id);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'صحيح': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'حسن': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ضعيف': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCollectionColor = (collection: string) => {
    switch (collection) {
      case 'الأربعون النووية': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'صحيح البخاري': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'صحيح مسلم': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'سنن أبي داود': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'سنن الترمذي': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
      case 'سنن ابن ماجه': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100 dark:border-gray-700 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-semibold">
              الحديث {hadith.id}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getCollectionColor(hadith.collection)}`}>
              {hadith.collection}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${getGradeColor(hadith.grade)}`}>
              <Award className="h-3 w-3 ml-1" />
              {hadith.grade}
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'text-red-500 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-emerald-700 dark:text-emerald-300 font-semibold mb-2 text-right">
            {hadith.theme}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-right">
            الراوي: {hadith.narrator}
          </p>
        </div>

        <div className="text-right leading-relaxed mb-4">
          <p className="text-gray-800 dark:text-white font-amiri text-lg mb-3">
            {showFullText ? hadith.arabicText : truncateText(hadith.arabicText)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {showFullText ? hadith.translation : truncateText(hadith.translation)}
          </p>
        </div>

        {progress && (
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900 rounded-lg p-3 mb-4">
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              مراجعات: {progress.reviewCount}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              دقة: {Math.round(progress.accuracy)}%
            </div>
            {progress.memorized && (
              <div className="bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-xs flex items-center">
                <Star className="h-3 w-3 ml-1" />
                محفوظ
              </div>
            )}
          </div>
        )}

        {!showFullText && (
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm mb-4">
            <Eye className="h-4 w-4 ml-2" />
            <span>اضغط لقراءة الحديث كاملاً</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {hadith.keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HadithCard;