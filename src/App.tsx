import React, { useState, useEffect } from 'react';
import { Search, MapPin, FileText, Settings, Download, BarChart3, Clock, Building2, Map, AlertCircle, CheckCircle, Activity, Users, TrendingUp, Target, Globe, Shield } from 'lucide-react';

interface PlanData {
  planNumber: string;
  planName: string;
  planType: string;
  status: string;
  area: string;
  location: {
    x: number;
    y: number;
    address: string;
  };
  municipality: string;
  planningAuthority: string;
  submissionDate: string;
  approvalDate: string;
  description: string;
  geometry?: any;
  statusColor: string;
  planCategory: 'תכנית ארצית' | 'תכנית מחוזית' | 'תכנית מקומית' | 'תכנית מקוונת' | 'תכנית לא מקוונת';
}

interface AnalysisResult {
  planType: string;
  objectives: string[];
  areaImpact: string;
  challenges: string[];
  recommendations: string[];
  summary: string;
  riskLevel: 'נמוך' | 'בינוני' | 'גבוה';
  opportunities: string[];
  timeline: string;
  budgetEstimate: string;
  stakeholders: string[];
}

interface GeminiResponse {
  analysis: AnalysisResult;
  confidence: number;
  processingTime: number;
}

// Mock XPlan Service Functions
const XPlanService = {
  async searchByPlanNumber(planNumber: string): Promise<PlanData | null> {
    // Simulate API call to XPLAN
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const planType = identifyPlanType(planNumber);
    
    return {
      planNumber,
      planName: `תכנית ${planType} - ${planNumber}`,
      planType,
      status: 'בתוקף',
      area: '125,000 מ"ר',
      location: {
        x: 180000,
        y: 665000,
        address: 'תל אביב-יפו'
      },
      municipality: 'תל אביב-יפו',
      planningAuthority: 'המועצה הארצית לתכנון ובנייה',
      submissionDate: '2023-01-15',
      approvalDate: '2023-06-20',
      description: 'תכנית לפיתוח מגורים ומסחר באזור מרכזי',
      statusColor: 'green',
      planCategory: planType as any
    };
  },

  async searchByAddress(address: string): Promise<PlanData[]> {
    // Simulate geocoding and plan search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        planNumber: 'תמא/35/א/8',
        planName: 'תכנית מתאר ארצית - חיזוק מרכזי עיר',
        planType: 'תכנית ארצית',
        status: 'בתוקף',
        area: '125,000 מ"ר',
        location: {
          x: 180000,
          y: 665000,
          address: address
        },
        municipality: 'תל אביב-יפו',
        planningAuthority: 'המועצה הארצית לתכנון ובנייה',
        submissionDate: '2023-01-15',
        approvalDate: '2023-06-20',
        description: 'תכנית לחיזוק מרכזי עיר ופיתוח מסחרי ומגורים',
        statusColor: 'green',
        planCategory: 'תכנית ארצית'
      }
    ];
  },

  async getBlueLines(bounds?: any): Promise<PlanData[]> {
    // Simulate fetching blue lines from ArcGIS
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        planNumber: 'ג/1234/א',
        planName: 'תכנית מתאר מקומית',
        planType: 'תכנית מקומית',
        status: 'בהכנה',
        area: '50,000 מ"ר',
        location: {
          x: 180500,
          y: 665500,
          address: 'רמת גן'
        },
        municipality: 'רמת גן',
        planningAuthority: 'ועדה מקומית לתכנון ובנייה',
        submissionDate: '2024-01-10',
        approvalDate: '',
        description: 'תכנית למגורים ושירותים',
        statusColor: 'orange',
        planCategory: 'תכנית לא מקוונת'
      }
    ];
  }
};

// Mock Gemini Service
const GeminiService = {
  async analyzePlanningData(planData: PlanData, apiKey: string): Promise<GeminiResponse> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const analysis: AnalysisResult = {
      planType: `${planData.planType} - ${planData.planNumber}`,
      objectives: [
        'פיתוח מגורים איכותיים ונגישים',
        'שיפור התשתיות הציבוריות',
        'יצירת מרחבים ציבוריים פתוחים',
        'עידוד פעילות כלכלית מקומית',
        'שמירה על אופי האזור'
      ],
      areaImpact: `התכנית צפויה להשפיע באופן משמעותי על האזור דרך הגדלת הצפיפות ב-${planData.area}, שיפור התחבורה הציבורית, ויצירת מרחבים ציבוריים חדשים. השפעה חיובית על הכלכלה המקומית וערכי הנדל"ן.`,
      challenges: [
        'עלייה בצפיפות האוכלוסייה והעומס על התשתיות',
        'צורך בפתרונות תחבורה וחניות',
        'השפעה על תושבים קיימים במהלך הבנייה',
        'תיאום מורכב עם גורמים מרובים',
        'אתגרים סביבתיים ונוף עירוני'
      ],
      recommendations: [
        'פיתוח תכנית תחבורה משולבת עם דגש על תחבורה ציבורית',
        'יצירת מרחבים ציבוריים איכותיים ונגישים',
        'תכנון שלבי עם הדרגתיות ביישום',
        'שיתוף הציבור והתייעצות עם התושבים',
        'הקפדה על עיצוב אדריכלי המשתלב עם הסביבה'
      ],
      summary: `תכנית מתקדמת ומקצועית המספקת מסגרת חשובה לפיתוח עירוני מאוזן. התכנית מציעה פתרונות חדשניים לצרכי המגורים והפעילות הכלכלית תוך שמירה על איכות החיים. מומלץ לתמוך בתכנית עם דגש על יישום מדורג, תכנון תחבורה מתאים ושיתוף הציבור.`,
      riskLevel: 'בינוני',
      opportunities: [
        'הגדלת היצע המגורים באזור מרכזי',
        'פיתוח כלכלי ויצירת מקומות עבודה',
        'שיפור איכות החיים והשירותים',
        'העלאת ערכי הנדל"ן באזור'
      ],
      timeline: '3-5 שנים ליישום מלא',
      budgetEstimate: '₪500-750 מיליון',
      stakeholders: [
        'רשות התכנון המקומית',
        'תושבי האזור',
        'יזמים ומפתחים',
        'חברות התשתיות',
        'ארגונים סביבתיים'
      ]
    };

    return {
      analysis,
      confidence: 0.85,
      processingTime: 2.3
    };
  }
};

function identifyPlanType(planNumber: string): string {
  if (planNumber.includes('תמא/') || planNumber.includes('TAMA')) return 'תכנית ארצית';
  if (planNumber.includes('תמל/')) return 'תכנית מקומית מפורטת';
  if (planNumber.includes('תתל/')) return 'תכנית תשתיות';
  if (planNumber.includes('compilation')) return 'תכנית מחוזית';
  if (/^\d/.test(planNumber)) return 'תכנית מקוונת';
  if (/^[א-ת]/.test(planNumber)) return 'תכנית לא מקוונת';
  return 'תכנית מקומית';
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [multiplePlans, setMultiplePlans] = useState<PlanData[]>([]);
  const [analysis, setAnalysis] = useState<GeminiResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'plan' | 'address' | 'area'>('plan');
  const [notifications, setNotifications] = useState<string[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    const savedSearches = localStorage.getItem('recentSearches');
    
    if (savedApiKey) setGeminiApiKey(savedApiKey);
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('geminiApiKey', geminiApiKey);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    setShowSettings(false);
    addNotification('הגדרות נשמרו בהצלחה');
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setCurrentPlan(null);
    setMultiplePlans([]);
    setAnalysis(null);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
    
    try {
      if (searchType === 'plan') {
        const planData = await XPlanService.searchByPlanNumber(searchTerm);
        if (planData) {
          setCurrentPlan(planData);
          addNotification(`נמצאה תכנית: ${planData.planNumber}`);
        } else {
          addNotification('לא נמצאה תכנית עם המספר שהוזן');
        }
      } else if (searchType === 'address') {
        const plans = await XPlanService.searchByAddress(searchTerm);
        if (plans.length > 0) {
          setMultiplePlans(plans);
          addNotification(`נמצאו ${plans.length} תכניות באזור`);
        } else {
          addNotification('לא נמצאו תכניות באזור שהוזן');
        }
      } else if (searchType === 'area') {
        const blueLines = await XPlanService.getBlueLines();
        setMultiplePlans(blueLines);
        addNotification(`נמצאו ${blueLines.length} קווים כחולים באזור`);
      }
    } catch (error) {
      addNotification('שגיאה בחיפוש. אנא נסה שוב.');
    } finally {
      setIsSearching(false);
    }
  };

  const analyzeWithGemini = async () => {
    if (!currentPlan) return;
    
    if (!geminiApiKey) {
      addNotification('אנא הזן מפתח Gemini API בהגדרות');
      setShowSettings(true);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await GeminiService.analyzePlanningData(currentPlan, geminiApiKey);
      setAnalysis(result);
      addNotification(`ניתוח הושלם בהצלחה (רמת ביטחון: ${Math.round(result.confidence * 100)}%)`);
    } catch (error) {
      addNotification('שגיאה בניתוח. אנא בדוק את מפתח ה-API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportData = () => {
    if (!currentPlan) return;
    
    const exportObj = {
      planData: currentPlan,
      analysis: analysis?.analysis,
      metadata: {
        exportDate: new Date().toISOString(),
        exportedBy: 'מנתח קווים כחולים',
        version: '1.0.0',
        confidence: analysis?.confidence,
        processingTime: analysis?.processingTime
      }
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `plan-analysis-${currentPlan.planNumber.replace(/\//g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addNotification('הנתונים יוצאו בהצלחה');
  };

  const selectPlan = (plan: PlanData) => {
    setCurrentPlan(plan);
    setMultiplePlans([]);
    addNotification(`נבחרה תכנית: ${plan.planNumber}`);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'נמוך': return 'text-green-700 bg-green-100';
      case 'בינוני': return 'text-yellow-700 bg-yellow-100';
      case 'גבוה': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'בתוקף': return 'text-green-700 bg-green-100';
      case 'בהכנה': return 'text-orange-700 bg-orange-100';
      case 'מושעה': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 left-4 z-50 space-y-2">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse"
              >
                {notification}
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">מנתח קווים כחולים</h1>
                <p className="text-gray-600 mt-1">כלי מתקדם לניתוח נתוני תכנון עם בינה מלאכותית Gemini AI</p>
                <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Activity className="w-4 h-4 ml-1" />
                    מחובר ל-XPLAN
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Globe className="w-4 h-4 ml-1" />
                    תומך בכל סוגי התכניות
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 ml-2" />
              הגדרות מתקדמות
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-xs text-gray-500 mt-1">נדרש לניתוח חכם של התכניות</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הגדרות חיפוש
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" defaultChecked />
                    <span className="text-sm">הצג התראות בזמן אמת</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" defaultChecked />
                    <span className="text-sm">שמור היסטוריית חיפושים</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={saveSettings}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Shield className="w-4 h-4 ml-2" />
                שמור הגדרות
              </button>
            </div>
          </div>
        )}

        {/* Advanced Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-teal-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Search className="w-5 h-5 ml-2" />
            חיפוש מתקדם
          </h3>
          
          {/* Search Type Selector */}
          <div className="flex space-x-4 space-x-reverse mb-4">
            <button
              onClick={() => setSearchType('plan')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'plan' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline ml-2" />
              חיפוש תכנית
            </button>
            <button
              onClick={() => setSearchType('address')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'address' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4 inline ml-2" />
              חיפוש לפי כתובת
            </button>
            <button
              onClick={() => setSearchType('area')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'area' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Map className="w-4 h-4 inline ml-2" />
              קווים כחולים באזור
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                searchType === 'plan' ? 'מספר תכנית (תמא/35, ג/1234, וכו...)' :
                searchType === 'address' ? 'כתובת או שם יישוב' :
                'השאר ריק לחיפוש כללי'
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white ml-2"></div>
                  מחפש...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 ml-2" />
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

        {/* Multiple Plans Results */}
        {multiplePlans.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-green-500">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              תוצאות חיפוש ({multiplePlans.length} תכניות)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {multiplePlans.map((plan, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => selectPlan(plan)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{plan.planNumber}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.planName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 ml-1" />
                    {plan.location.address}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Data Display */}
        {currentPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-indigo-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 ml-2" />
                נתוני התכנית המפורטים
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
                      מנתח עם Gemini AI...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 ml-2" />
                      נתח עם Gemini AI
                    </>
                  )}
                </button>
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 ml-2" />
                  ייצא נתונים
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="w-5 h-5 text-blue-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">מספר תכנית</p>
                    <p className="font-semibold text-blue-700">{currentPlan.planNumber}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <Building2 className="w-5 h-5 text-teal-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">סוג תכנית</p>
                    <p className="font-semibold text-teal-700">{currentPlan.planType}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">סטטוס</p>
                    <p className="font-semibold text-green-700">{currentPlan.status}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Map className="w-5 h-5 text-purple-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">שטח</p>
                    <p className="font-semibold text-purple-700">{currentPlan.area}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <MapPin className="w-5 h-5 text-orange-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">מיקום</p>
                    <p className="font-semibold text-orange-700">{currentPlan.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Building2 className="w-5 h-5 text-gray-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">רשות מקומית</p>
                    <p className="font-semibold text-gray-700">{currentPlan.municipality}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <Clock className="w-5 h-5 text-indigo-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">תאריך הגשה</p>
                    <p className="font-semibold text-indigo-700">{new Date(currentPlan.submissionDate).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <Clock className="w-5 h-5 text-pink-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">תאריך אישור</p>
                    <p className="font-semibold text-pink-700">
                      {currentPlan.approvalDate ? new Date(currentPlan.approvalDate).toLocaleDateString('he-IL') : 'טרם אושר'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Users className="w-5 h-5 text-yellow-500 ml-3" />
                  <div>
                    <p className="text-sm text-gray-600">רשות התכנון</p>
                    <p className="font-semibold text-yellow-700">{currentPlan.planningAuthority}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 ml-2" />
                תיאור התכנית
              </h4>
              <p className="text-gray-600">{currentPlan.description}</p>
            </div>
          </div>
        )}

        {/* Enhanced Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-emerald-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart3 className="w-5 h-5 ml-2" />
                ניתוח Gemini AI מתקדם
              </h3>
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(analysis.analysis.riskLevel)}`}>
                  רמת סיכון: {analysis.analysis.riskLevel}
                </span>
                <span className="text-sm text-gray-500">
                  ביטחון: {Math.round(analysis.confidence * 100)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Target className="w-4 h-4 ml-2" />
                    מטרות התכנית
                  </h4>
                  <ul className="text-blue-700 space-y-2">
                    {analysis.analysis.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 ml-2 mt-1">•</span>
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 ml-2" />
                    הזדמנויות
                  </h4>
                  <ul className="text-green-700 space-y-2">
                    {analysis.analysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 ml-2 mt-1">•</span>
                        <span className="text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-r-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 ml-2" />
                    אתגרים ואילוצים
                  </h4>
                  <ul className="text-orange-700 space-y-2">
                    {analysis.analysis.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 ml-2 mt-1">•</span>
                        <span className="text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-lg border-r-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    המלצות יישום
                  </h4>
                  <ul className="text-purple-700 space-y-2">
                    {analysis.analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 ml-2 mt-1">•</span>
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-teal-50 rounded-lg border-r-4 border-teal-500">
                  <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 ml-2" />
                    בעלי עניין מרכזיים
                  </h4>
                  <ul className="text-teal-700 space-y-2">
                    {analysis.analysis.stakeholders.map((stakeholder, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-500 ml-2 mt-1">•</span>
                        <span className="text-sm">{stakeholder}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h5 className="font-semibold text-indigo-800 mb-2">לוח זמנים משוער</h5>
                    <p className="text-indigo-700 text-sm">{analysis.analysis.timeline}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-yellow-800 mb-2">הערכת תקציב</h5>
                    <p className="text-yellow-700 text-sm">{analysis.analysis.budgetEstimate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-r-4 border-gray-500">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-4 h-4 ml-2" />
                השפעה על האזור
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.analysis.areaImpact}</p>
            </div>
            
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-r-4 border-emerald-500">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 ml-2" />
                סיכום מקצועי
              </h4>
              <p className="text-emerald-700 text-sm leading-relaxed">{analysis.analysis.summary}</p>
            </div>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-gray-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 ml-2" />
            פעולות מהירות ומתקדמות
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group">
              <Search className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-blue-700">חיפוש מתקדם</p>
              <p className="text-xs text-blue-600 mt-1">XPLAN + GIS</p>
            </button>
            <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors text-center group">
              <Map className="w-6 h-6 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-teal-700">מפה אינטראקטיבית</p>
              <p className="text-xs text-teal-600 mt-1">ArcGIS Online</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group">
              <FileText className="w-6 h-6 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-green-700">דוחות מהירים</p>
              <p className="text-xs text-green-600 mt-1">PDF + Excel</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group">
              <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-purple-700">ניתוח AI</p>
              <p className="text-xs text-purple-600 mt-1">Gemini Pro</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>מנתח קווים כחולים © 2024 - כלי מתקדם לניתוח נתוני תכנון ישראלי עם בינה מלאכותית</p>
          <p className="mt-1">מופעל על ידי XPLAN API, ArcGIS Services ו-Gemini AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;