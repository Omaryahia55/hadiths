import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen, Edit3, Users, Tag } from 'lucide-react';
import { hadiths } from '../data/hadiths';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import { Exercise } from '../types';

const Exercises: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { userData, updateProgress, getUserProgress } = useUser();
  const { fontSize } = useSettings();
  
  const favoritesOnly = searchParams.get('favorites') === 'true';
  const availableHadiths = favoritesOnly 
    ? hadiths.filter(h => userData.favorites.includes(h.id))
    : hadiths;

  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [exerciseNumber, setExerciseNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHadith, setSelectedHadith] = useState<any>(null);

  const exerciseTypes = [
    { type: 'full-text', label: 'كتابة مضمون الحديث', icon: Edit3 },
    { type: 'narrator-choice', label: 'اختيار الراوي', icon: Users },
    { type: 'theme-choice', label: 'اختيار الموضوع', icon: Tag },
  ];

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-base';
      case 'large': return 'text-xl';
      default: return 'text-lg';
    }
  };

  const generateFullTextExercise = (hadith: any): Exercise => {
    return {
      id: `full-text-${hadith.id}-${Date.now()}`,
      hadithId: hadith.id,
      type: 'full-text',
      question: `اكتب مضمون الحديث رقم ${hadith.id} (النص العربي فقط بدون ذكر الراوي أو المصدر):\n\nالموضوع: ${hadith.theme}`,
      correctAnswer: hadith.arabicText,
      exerciseNumber: 1,
    };
  };

  const generateNarratorChoiceExercise = (hadith: any): Exercise => {
    // Get other narrators from different hadiths
    const otherNarrators = hadiths
      .filter(h => h.id !== hadith.id)
      .map(h => h.narrator)
      .filter((narrator, index, arr) => arr.indexOf(narrator) === index) // Remove duplicates
      .slice(0, 3);

    // Shuffle and create options
    const options = [hadith.narrator, ...otherNarrators].sort(() => Math.random() - 0.5);

    return {
      id: `narrator-${hadith.id}-${Date.now()}`,
      hadithId: hadith.id,
      type: 'narrator-choice',
      question: `من هو الصحابي راوي هذا الحديث؟\n\n"${hadith.arabicText.substring(0, 100)}..."`,
      options,
      correctAnswer: hadith.narrator,
      exerciseNumber: 2,
    };
  };

  const generateThemeChoiceExercise = (hadith: any): Exercise => {
    // Get other themes from different hadiths
    const otherThemes = hadiths
      .filter(h => h.id !== hadith.id)
      .map(h => h.theme)
      .filter((theme, index, arr) => arr.indexOf(theme) === index) // Remove duplicates
      .slice(0, 3);

    // Shuffle and create options
    const options = [hadith.theme, ...otherThemes].sort(() => Math.random() - 0.5);

    return {
      id: `theme-${hadith.id}-${Date.now()}`,
      hadithId: hadith.id,
      type: 'theme-choice',
      question: `ما هو موضوع هذا الحديث؟\n\n"${hadith.arabicText.substring(0, 150)}..."`,
      options,
      correctAnswer: hadith.theme,
      exerciseNumber: 3,
    };
  };

  const generateNewExercise = () => {
    if (availableHadiths.length === 0) return;
    
    setIsLoading(true);
    try {
      let exercise: Exercise;
      let hadith = selectedHadith;

      // If starting new sequence or no hadith selected, pick a random one
      if (exerciseNumber === 1 || !hadith) {
        hadith = availableHadiths[Math.floor(Math.random() * availableHadiths.length)];
        setSelectedHadith(hadith);
      }

      // Generate exercise based on current exercise number
      switch (exerciseNumber) {
        case 1:
          exercise = generateFullTextExercise(hadith);
          break;
        case 2:
          exercise = generateNarratorChoiceExercise(hadith);
          break;
        case 3:
          exercise = generateThemeChoiceExercise(hadith);
          break;
        default:
          // Reset to exercise 1 with new hadith
          setExerciseNumber(1);
          hadith = availableHadiths[Math.floor(Math.random() * availableHadiths.length)];
          setSelectedHadith(hadith);
          exercise = generateFullTextExercise(hadith);
      }
      
      setCurrentExercise(exercise);
      setUserAnswer('');
      setShowResult(false);
      setTotalQuestions(prev => prev + 1);
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeArabicText = (text: string): string => {
    return text
      .replace(/[،؛:.]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .toLowerCase();
  };

  const checkAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return;
    
    let isCorrect = false;

    if (currentExercise.type === 'full-text') {
      const normalizedUserAnswer = normalizeArabicText(userAnswer);
      const normalizedCorrectAnswer = normalizeArabicText(currentExercise.correctAnswer);
      
      // Calculate similarity percentage for full text
      const similarity = calculateSimilarity(normalizedUserAnswer, normalizedCorrectAnswer);
      isCorrect = similarity >= 0.7; // 70% similarity threshold
    } else {
      // For choice questions, exact match
      isCorrect = userAnswer.trim() === currentExercise.correctAnswer;
    }
    
    setShowResult(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Update progress
    const existingProgress = getUserProgress(currentExercise.hadithId);
    const newAccuracy = existingProgress
      ? ((existingProgress.accuracy * existingProgress.reviewCount) + (isCorrect ? 100 : 0)) / (existingProgress.reviewCount + 1)
      : (isCorrect ? 100 : 0);

    updateProgress({
      hadithId: currentExercise.hadithId,
      memorized: newAccuracy > 80,
      lastReviewed: new Date().toISOString(),
      reviewCount: (existingProgress?.reviewCount || 0) + 1,
      accuracy: newAccuracy,
    });
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const maxLength = Math.max(words1.length, words2.length);
    
    if (maxLength === 0) return 1;
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.includes(word)) {
        matches++;
      }
    });
    
    return matches / maxLength;
  };

  const nextQuestion = () => {
    if (exerciseNumber < 3) {
      setExerciseNumber(prev => prev + 1);
    } else {
      setExerciseNumber(1);
      setSelectedHadith(null); // Reset to pick new hadith
    }
    generateNewExercise();
  };

  const resetExercise = () => {
    setScore(0);
    setTotalQuestions(0);
    setExerciseNumber(1);
    setSelectedHadith(null);
    setCurrentExercise(null);
    setUserAnswer('');
    setShowResult(false);
    generateNewExercise();
  };

  useEffect(() => {
    if (availableHadiths.length > 0) {
      generateNewExercise();
    }
  }, []);

  if (availableHadiths.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {favoritesOnly ? 'لا توجد أحاديث مفضلة' : 'لا توجد تمارين متاحة'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {favoritesOnly 
              ? 'أضف بعض الأحاديث إلى المفضلة أولاً'
              : 'ابدأ بدراسة الأحاديث أولاً'
            }
          </p>
          <button
            onClick={() => window.location.href = favoritesOnly ? '/hadiths' : '/'}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <BookOpen className="h-5 w-5" />
            <span>{favoritesOnly ? 'تصفح الأحاديث' : 'العودة للرئيسية'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center font-amiri flex items-center justify-center">
          <Target className="h-8 w-8 text-blue-600 ml-3" />
          تمارين الحفظ
        </h1>
        
        {/* Exercise Types Display */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 grid grid-cols-3 gap-4 max-w-2xl">
            {exerciseTypes.map((exercise, index) => (
              <div
                key={exercise.type}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  exerciseNumber === index + 1
                    ? 'bg-blue-600 text-white'
                    : exerciseNumber > index + 1
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}
              >
                <exercise.icon className="h-6 w-6 mb-2" />
                <span className="text-xs text-center font-medium">
                  {exercise.label}
                </span>
                <span className="text-xs mt-1">
                  التمرين {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center space-x-6 space-x-reverse">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">إجابات صحيحة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{totalQuestions}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">إجمالي الأسئلة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">نسبة النجاح</div>
          </div>
        </div>
      </div>

      {/* Exercise */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحضير السؤال...</p>
        </div>
      ) : currentExercise ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-semibold">
                الحديث {currentExercise.hadithId}
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                التمرين {exerciseNumber} من 3
              </div>
            </div>
            
            <p className={`${getFontSizeClass()} leading-relaxed font-amiri text-gray-800 dark:text-white text-right mb-6 whitespace-pre-line`}>
              {currentExercise.question}
            </p>
          </div>

          {!showResult ? (
            <div className="space-y-4">
              {currentExercise.type === 'full-text' ? (
                <div>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="اكتب مضمون الحديث هنا (النص العربي فقط)..."
                    className={`w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-right ${getFontSizeClass()} font-amiri focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 leading-relaxed bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
                    dir="rtl"
                    rows={6}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-right">
                    💡 نصيحة: اكتب مضمون الحديث فقط بدون ذكر الراوي أو المصدر
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentExercise.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setUserAnswer(option)}
                      className={`p-4 border-2 rounded-lg text-right font-medium transition-all transform hover:scale-105 ${
                        userAnswer === option
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  تحقق من الإجابة
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={`inline-flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg ${
                (currentExercise.type === 'full-text' 
                  ? calculateSimilarity(normalizeArabicText(userAnswer), normalizeArabicText(currentExercise.correctAnswer)) >= 0.7
                  : userAnswer.trim() === currentExercise.correctAnswer)
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {(currentExercise.type === 'full-text' 
                  ? calculateSimilarity(normalizeArabicText(userAnswer), normalizeArabicText(currentExercise.correctAnswer)) >= 0.7
                  : userAnswer.trim() === currentExercise.correctAnswer) ? (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">إجابة صحيحة! أحسنت</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6" />
                    <span className="font-semibold">إجابة خاطئة</span>
                  </>
                )}
              </div>
              
              {!(currentExercise.type === 'full-text' 
                ? calculateSimilarity(normalizeArabicText(userAnswer), normalizeArabicText(currentExercise.correctAnswer)) >= 0.7
                : userAnswer.trim() === currentExercise.correctAnswer) && (
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">الإجابة الصحيحة:</p>
                  <p className={`text-blue-700 dark:text-blue-300 font-amiri ${getFontSizeClass()} text-right leading-relaxed`}>
                    {currentExercise.correctAnswer}
                  </p>
                </div>
              )}
              
              <button
                onClick={nextQuestion}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                {exerciseNumber < 3 ? 'التمرين التالي' : 'حديث جديد'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">حدث خطأ في تحميل التمرين</p>
          <button
            onClick={generateNewExercise}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Progress Summary */}
      {totalQuestions >= 9 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">ممتاز! استمر في التدريب</h3>
          <p className="opacity-90 mb-4">
            لقد أجبت على {totalQuestions} أسئلة بنسبة نجاح {Math.round((score / totalQuestions) * 100)}%
          </p>
          <button
            onClick={resetExercise}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            <span>بدء جلسة جديدة</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Exercises;