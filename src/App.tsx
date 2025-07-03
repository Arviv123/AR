import React, { useState, useEffect } from 'react';
import { Search, MapPin, FileText, Settings, Download, BarChart3, Clock, Building2, Map } from 'lucide-react';

interface PlanData {
  planNumber: string;
  planName: string;
  planType: string;
  status: string;
  area: string;
  location: string;
  municipality: string;
  planningAuthority: string;
  submissionDate: string;
  approvalDate: string;
  description: string;
}

interface AnalysisResult {
  planType: string;
  objectives: string[];
  areaImpact: string;
  challenges: string[];
  recommendations: string[];
  summary: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mock data for demonstration
  const mockPlanData: PlanData = {
    planNumber: 'תמא/35/א/8',
    planName: 'תכנית מתאר ארצית - חיזוק מרכזי עיר',
    planType: 'תכנית ארצית',
    status: 'בתוקף',
    area: '125,000 מ"ר',
    location: 'תל אביב-יפו',
    municipality: 'תל אביב-יפו',
    planningAuthority: 'המועצה הארצית לתכנון ובנייה',
    submissionDate: '2023-01-15',
    approvalDate: '2023-06-20',
    description: 'תכנית לחיזוק מרכזי עיר ופיתוח מסחרי ומגורים'
  };

  const mockAnalysis: AnalysisResult = {
    planType: 'תכנית ארצית (תמא) - חיזוק מרכזי עיר',
    objectives: [
      'חיזוק מרכזי העיר והפיכתם לאזורים אטרקטיביים',
      'עידוד מגורים במרכזי ערים',
      'פיתוח מסחר ושירותים ברמה עירונית',
      'שיפור איכות החיים האורבנית'
    ],
    areaImpact: 'התכנית תשפיע באופן חיובי על האזור דרך פיתוח מסחרי ומגורים איכותי, שיפור התחבורה הציבורית, ויצירת מרחבים ציבוריים. הצפיפות תגדל אך תישמר איכות החיים.',
    challenges: [
      'עלייה בצפיפות והעומס על התשתיות',
      'תחבורה וחניות - צורך בפתרונות יצירתיים',
      'השפעה על בעלי נכסים קיימים',
      'תיאום עם רשויות מקומיות'
    ],
    recommendations: [
      'פיתוח תחבורה ציבורית משולבת',
      'יצירת מרחבים ציבוריים איכותיים',
      'הקפדה על עיצוב אדריכלי ברמה גבוהה',
      'תכנון שלבי ליישום הדרגתי'
    ],
    summary: 'תכנית מתקדמת ומקצועית לחיזוק מרכזי עיר. מספקת מסגרת חשובה לפיתוח עירוני איכותי תוך שמירה על איכות החיים. מומלץ לתמוך בתכנית עם דגש על יישום מדורג ותכנון תחבורה מתאים.'
  };

  const identifyPlanType = (planNumber: string): string => {
    if (planNumber.includes('תמא/')) return 'תכנית ארצית';
    if (planNumber.includes('תמל/')) return 'תכנית מקומית מפורטת';
    if (planNumber.includes('תתל/')) return 'תכנית תשתיות';
    if (/^\d/.test(planNumber)) return 'תכנית מקוונת';
    if (/^[א-ת]/.test(planNumber)) return 'תכנית לא מקוונת';
    return 'סוג לא מזוהה';
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsAnalyzing(true);
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
      return updated;
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentPlan(mockPlanData);
    setIsAnalyzing(false);
  };

  const analyzeWithGemini = async () => {
    if (!currentPlan) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const exportData = () => {
    const exportObj = {
      planData: currentPlan,
      analysis: analysis,
      exportDate: new Date().toISOString(),
      exportedBy: 'מנתח קווים כחולים'
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `plan-analysis-${currentPlan?.planNumber?.replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">מנתח קווים כחולים</h1>
                <p className="text-gray-600">כלי מתקדם לניתוח נתוני תכנון עם בינה מלאכותית</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 ml-2" />
              הגדרות
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מפתח Gemini API
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="הזן מפתח API"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                שמור הגדרות
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Search className="w-5 h-5 ml-2" />
            חיפוש תכנית
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="מספר תכנית, כתובת או מיקום"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white ml-2"></div>
                  מחפש...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 ml-2" />
                  חפש
                </>
              )}
            </button>
          </div>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">חיפושים אחרונים:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Plan Data Display */}
        {currentPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 ml-2" />
                נתוני התכנית
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={analyzeWithGemini}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors flex items-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white ml-2"></div>
                      מנתח...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 ml-2" />
                      נתח עם Gemini
                    </>
                  )}
                </button>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 ml-2" />
                  ייצא
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">מספר תכנית</p>
                    <p className="font-semibold text-blue-700">{currentPlan.planNumber}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-teal-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">סוג תכנית</p>
                    <p className="font-semibold text-teal-700">{currentPlan.planType}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">סטטוס</p>
                    <p className="font-semibold text-green-700">{currentPlan.status}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <Map className="w-5 h-5 text-purple-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">שטח</p>
                    <p className="font-semibold text-purple-700">{currentPlan.area}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">מיקום</p>
                    <p className="font-semibold text-orange-700">{currentPlan.location}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">רשות התכנון</p>
                    <p className="font-semibold text-gray-700">{currentPlan.planningAuthority}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">תאריך הגשה</p>
                    <p className="font-semibold text-indigo-700">{new Date(currentPlan.submissionDate).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                  <Clock className="w-5 h-5 text-pink-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">תאריך אישור</p>
                    <p className="font-semibold text-pink-700">{new Date(currentPlan.approvalDate).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">תיאור התכנית</h4>
              <p className="text-gray-600">{currentPlan.description}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 ml-2" />
              ניתוח Gemini AI
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">זיהוי סוג תכנית</h4>
                <p className="text-blue-700">{analysis.planType}</p>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-lg border-r-4 border-teal-500">
                <h4 className="font-semibold text-teal-800 mb-2">מטרות התכנית</h4>
                <ul className="text-teal-700 space-y-1">
                  {analysis.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-teal-500 ml-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-2">השפעה על האזור</h4>
                <p className="text-green-700">{analysis.areaImpact}</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-r-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 mb-2">אתגרים ואילוצים</h4>
                <ul className="text-orange-700 space-y-1">
                  {analysis.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 ml-2">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-r-4 border-purple-500">
                <h4 className="font-semibold text-purple-800 mb-2">המלצות</h4>
                <ul className="text-purple-700 space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 ml-2">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border-r-4 border-gray-500">
                <h4 className="font-semibold text-gray-800 mb-2">סיכום מקצועי</h4>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">פעולות מהירות</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
              <Search className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-700">חיפוש מתקדם</p>
            </button>
            <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors text-center">
              <Map className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-teal-700">מפה אינטראקטיבית</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
              <FileText className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">דוחות מהירים</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
              <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-700">ניתוחים מתקדמים</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>מנתח קווים כחולים © 2024 - כלי מתקדם לניתוח נתוני תכנון ישראלי</p>
        </div>
      </div>
    </div>
  );
}

export default App;