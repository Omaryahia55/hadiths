import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen } from 'lucide-react';
import { hadiths } from '../data/hadiths';
import { useUser } from '../context/UserContext';
import HadithCard from '../components/HadithCard';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const favoriteHadiths = hadiths.filter(hadith => 
    userData.favorites.includes(hadith.id)
  );

  const handleHadithClick = (hadithId: number) => {
    navigate(`/hadith/${hadithId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center font-amiri flex items-center justify-center">
          <Heart className="h-8 w-8 text-red-500 ml-3" />
          الأحاديث المفضلة
        </h1>
        <p className="text-gray-600 text-center">
          الأحاديث التي أضفتها إلى مفضلتك للمراجعة السريعة
        </p>
        
        {favoriteHadiths.length > 0 && (
          <div className="mt-4 text-center">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              {favoriteHadiths.length} حديث مفضل
            </span>
          </div>
        )}
      </div>

      {favoriteHadiths.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            لا توجد أحاديث مفضلة بعد
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ بإضافة الأحاديث التي تريد مراجعتها بسهولة
          </p>
          <button
            onClick={() => navigate('/hadiths')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <BookOpen className="h-5 w-5" />
            <span>تصفح الأحاديث</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {favoriteHadiths.map(hadith => (
            <HadithCard
              key={hadith.id}
              hadith={hadith}
              onClick={() => handleHadithClick(hadith.id)}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {favoriteHadiths.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4">مراجعة سريعة</h3>
          <p className="mb-4 opacity-90">
            اختبر حفظك للأحاديث المفضلة
          </p>
          <button
            onClick={() => navigate('/exercises?favorites=true')}
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            بدء التمارين للمفضلة
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;