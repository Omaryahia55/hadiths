import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // محاكاة إرسال الرسالة
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-20 h-20 mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-amiri">
            تم إرسال رسالتك بنجاح!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center font-amiri flex items-center justify-center">
          <MessageCircle className="h-8 w-8 text-blue-600 ml-3" />
          تواصل معنا
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          نحن هنا لمساعدتك في رحلة تعلم الأحاديث النبوية الشريفة
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              معلومات التواصل
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">البريد الإلكتروني</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">oy774790@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">الهاتف</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">+2137 78 39 95 43</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">العنوان</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">حي مزرعة سي رضوان رقم1</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              أسئلة شائعة
            </h3>
            <div className="space-y-3">
              <div className="border-r-4 border-emerald-400 bg-emerald-50 dark:bg-emerald-900 p-3 rounded">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">
                  كيف يمكنني حفظ الأحاديث بفعالية؟
                </h4>
                <p className="text-emerald-700 dark:text-emerald-300 text-xs mt-1">
                  استخدم التمارين التفاعلية والمراجعة المتكررة
                </p>
              </div>
              <div className="border-r-4 border-blue-400 bg-blue-50 dark:bg-blue-900 p-3 rounded">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                  هل التطبيق مجاني؟
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                  نعم، جميع الميزات متاحة مجاناً
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              أرسل لنا رسالة
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-right"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  موضوع الرسالة *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-right"
                >
                  <option value="">اختر موضوع الرسالة</option>
                  <option value="support">الدعم التقني</option>
                  <option value="suggestion">اقتراح تحسين</option>
                  <option value="bug">الإبلاغ عن خطأ</option>
                  <option value="content">محتوى الأحاديث</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرسالة *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-right resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2 space-x-reverse"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>إرسال الرسالة</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;