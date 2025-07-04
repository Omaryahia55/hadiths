import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Heart, BookMarked, Volume2, Share2 } from 'lucide-react';
import { hadiths } from '../data/hadiths';
import { useUser } from '../context/UserContext';

const HadithDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData, toggleFavorite, updateProgress, getUserProgress } = useUser();
  
  const hadithId = parseInt(id || '1');
  const hadith = hadiths.find(h => h.id === hadithId);
  const [showTranslation, setShowTranslation] = useState(true);
  
  if (!hadith) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">الحديث غير موجود</h2>
        <button
          onClick={() => navigate('/hadiths')}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
        >
          العودة للقائمة
        </button>
      </div>
    );
  }

  const isFavorite = userData.favorites.includes(hadithId);
  const progress = getUserProgress(hadithId);
  const nextHadith = hadiths.find(h => h.id === hadithId + 1);
  const prevHadith = hadiths.find(h => h.id === hadithId - 1);

  const markAsMemorized = () => {
    const newProgress = {
      hadithId,
      memorized: true,
      lastReviewed: new Date().toISOString(),
      reviewCount: (progress?.reviewCount || 0) + 1,
      accuracy: progress?.accuracy || 100,
    };
    updateProgress(newProgress);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `الحديث ${hadith.id} - الأربعون النووية`,
          text: hadith.arabicText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${hadith.arabicText}\n\n- الحديث ${hadith.id} من الأربعون النووية`);
      // You could show a toast notification here
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/hadiths')}
          className="flex items-center space-x-2 space-x-reverse text-emerald-600 hover:text-emerald-700"
        >
          <ArrowRight className="h-5 w-5" />
          <span>العودة للقائمة</span>
        </button>
        
        <div className="text-sm text-gray-600">
          الحديث {hadith.id} من {hadiths.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold font-amiri">
              الحديث {hadith.id}
            </h1>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => toggleFavorite(hadithId)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="text-emerald-100">
            <p className="font-semibold mb-1">{hadith.theme}</p>
            <p className="text-sm">الراوي: {hadith.narrator}</p>
          </div>
        </div>

        <div className="p-8">
          {/* Arabic Text */}
          <div className="bg-emerald-50 rounded-xl p-6 mb-6">
            <p className="text-right text-xl leading-relaxed font-amiri text-gray-800">
              {hadith.arabicText}
            </p>
          </div>

          {/* Translation Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {showTranslation ? 'إخفاء المعنى' : 'إظهار المعنى'}
            </button>
          </div>

          {/* Translation */}
          {showTranslation && (
            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-amber-800  mb-3">المعنى:</h3>
              <p className="text-right text-gray-700 leading-relaxed">
                {hadith.translation}
              </p>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-3">الشرح:</h3>
            <p className="text-right text-gray-700 leading-relaxed">
              {hadith.explanation}
            </p>
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">الكلمات المفتاحية:</h3>
            <div className="flex flex-wrap gap-2">
              {hadith.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            {!progress?.memorized && (
              <button
                onClick={markAsMemorized}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <BookMarked className="h-5 w-5" />
                <span>حفظت هذا الحديث</span>
              </button>
            )}
            
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse">
              <Volume2 className="h-5 w-5" />
              <span>استمع للتلاوة</span>
            </button>
          </div>

          {progress?.memorized && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">
                🎉 ممتاز! لقد حفظت هذا الحديث
              </p>
              <p className="text-green-600 text-sm mt-1">
                المراجعات: {progress.reviewCount} | الدقة: {Math.round(progress.accuracy)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation between hadiths */}
      <div className="flex justify-between">
        {prevHadith && (
          <button
            onClick={() => navigate(`/hadith/${prevHadith.id}`)}
            className="flex items-center space-x-2 space-x-reverse bg-white rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow"
          >
            <ArrowRight className="h-5 w-5 text-gray-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">السابق</div>
              <div className="font-semibold text-gray-800">الحديث {prevHadith.id}</div>
            </div>
          </button>
        )}
        
        {nextHadith && (
          <button
            onClick={() => navigate(`/hadith/${nextHadith.id}`)}
            className="flex items-center space-x-2 space-x-reverse bg-white rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow"
          >
            <div className="text-left">
              <div className="text-sm text-gray-600">التالي</div>
              <div className="font-semibold text-gray-800">الحديث {nextHadith.id}</div>
            </div>
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HadithDetail;