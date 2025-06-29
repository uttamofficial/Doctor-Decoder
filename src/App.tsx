import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import MedicalHistoryForm from './components/MedicalHistoryForm';
import InputSection from './components/InputSection';
import LoadingState from './components/LoadingState';
import ResultsSection from './components/ResultsSection';
import SecurityNotice from './components/SecurityNotice';
import Footer from './components/Footer';
import LanguageToggle from './components/LanguageToggle';
import DarkModeToggle from './components/DarkModeToggle';
import { MedicationIntelligence } from './utils/medicationIntelligence';
import { Language, getTranslation, getMedicationTranslation, translateMedicalTerms } from './utils/translations';
import OpenRouterAPI from './utils/openRouterAPI';

interface MedicationInfo {
  name: string;
  dosage: string;
  schedule: string;
  instructions: string;
  warnings?: string[];
  plainLanguage: string;
  personalizedDosage?: string;
  timingRecommendations?: string[];
}

interface FollowUpTip {
  type: 'question' | 'tip' | 'warning' | 'lifestyle';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface ProcessedPrescription {
  medications: MedicationInfo[];
  medicalTerms: { term: string; explanation: string; }[];
  generalInstructions: string[];
  medicalHistoryWarnings?: string[];
  personalizedRecommendations?: Array<{
    type: 'dosage' | 'timing' | 'duration' | 'warning' | 'monitoring';
    message: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  followUpTips?: FollowUpTip[];
  aiResponse?: string;
}

interface MedicalHistoryData {
  conditions: string[];
  allergies: string[];
  currentMedications: string[];
  additionalNotes: string;
}

interface PersonalDetails {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
}

function App() {
  const [currentStep, setCurrentStep] = useState<'personal' | 'history' | 'input' | 'processing' | 'results'>('personal');
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedPrescription | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'bn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Smooth scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
  };

  const handlePersonalDetailsComplete = (data: PersonalDetails) => {
    setPersonalDetails(data);
    setCurrentStep('history');
  };

  const handleMedicalHistoryComplete = (data: MedicalHistoryData) => {
    setMedicalHistory(data);
    setCurrentStep('input');
  };

  const translateMedications = (medications: MedicationInfo[]): MedicationInfo[] => {
    return medications.map(med => ({
      ...med,
      name: getMedicationTranslation(med.name, language),
      schedule: getMedicationTranslation(med.schedule, language),
      instructions: getMedicationTranslation(med.instructions, language),
      plainLanguage: getMedicationTranslation(med.plainLanguage, language),
      warnings: med.warnings?.map(warning => getMedicationTranslation(warning, language))
    }));
  };

  const translateGeneralInstructions = (instructions: string[]): string[] => {
    const instructionTranslations = {
      'Take medications at the same time each day to maintain consistent levels in your body': {
        en: 'Take medications at the same time each day to maintain consistent levels in your body',
        hi: 'अपने शरीर में निरंतर स्तर बनाए रखने के लिए हर दिन एक ही समय पर दवाएं लें',
        bn: 'আপনার শরীরে ধারাবাহিক মাত্রা বজায় রাখতে প্রতিদিন একই সময়ে ওষুধ নিন'
      },
      'Store all medications in a cool, dry place away from direct sunlight': {
        en: 'Store all medications in a cool, dry place away from direct sunlight',
        hi: 'সभी दवाओं को सीधी धूप से दूर ठंडी, सूखी जगह पर रखें',
        bn: 'সমস্ত ওষুধ সরাসরি সূর্যালোক থেকে দূরে ঠান্ডা, শুকনো জায়গায় সংরক্ষণ করুন'
      },
      'Keep all medications out of reach of children and pets': {
        en: 'Keep all medications out of reach of children and pets',
        hi: 'সभी दवाओं को बच्चों और पालतू जानवरों की पहुंच से दूर रखें',
        bn: 'সমস্ত ওষুধ শিশুদের এবং পোষা প্রাণীদের নাগালের বাইরে রাখুন'
      },
      'Complete the full course of antibiotics even if you feel better': {
        en: 'Complete the full course of antibiotics even if you feel better',
        hi: 'बेहतर महसूस करने पर भी एंटीबायोटिक्स का पूरा कोर्स पूरा करें',
        bn: 'ভাল লাগলেও অ্যান্টিবায়োটিকের সম্পূর্ণ কোর্স সম্পন্ন করুন'
      },
      'Don\'t share your medications with others, even if they have similar symptoms': {
        en: 'Don\'t share your medications with others, even if they have similar symptoms',
        hi: 'अपनी दवाएं दूसरों के साथ साझा न करें, भले ही उनके समान लक्ষण हों',
        bn: 'আপনার ওষুধ অন্যদের সাথে ভাগ করবেন না, এমনকি তাদের একই রকম লক্ষণ থাকলেও'
      },
      'Contact your doctor if you experience any unusual side effects': {
        en: 'Contact your doctor if you experience any unusual side effects',
        hi: 'यदि आप कोई असामान্য পার্শ্বপ্রতিক্রিয়া অনুভব করেন তাহলে আপনার ডাক্তারের সাথে যোগাযোগ করুন',
        bn: 'যদি আপনি কোনো অস্বাভাবিক পার্শ্বপ্রতিক্রিয়া অনুভব করেন তাহলে আপনার ডাক্তারের সাথে যোগাযোগ করুন'
      }
    };

    return instructions.map(instruction => {
      const translation = instructionTranslations[instruction as keyof typeof instructionTranslations];
      return translation ? translation[language] : instruction;
    });
  };

  const parseAIResponse = (aiResponse: string): Partial<ProcessedPrescription> => {
    // Parse the AI response to extract structured medication information
    // This is a simplified parser - you might want to make it more robust
    const medications: MedicationInfo[] = [];
    const generalInstructions: string[] = [];
    
    // Try to extract medication information from the AI response
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    let currentMed: Partial<MedicationInfo> = {};
    let inMedicationSection = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for medication names (usually contain "mg" or common drug patterns)
      if (trimmedLine.match(/\b\w+\s+\d+\s*mg\b/i) || trimmedLine.match(/^\d+\.\s*\w+/)) {
        if (currentMed.name) {
          medications.push(currentMed as MedicationInfo);
        }
        currentMed = {
          name: trimmedLine.replace(/^\d+\.\s*/, ''),
          dosage: '',
          schedule: '',
          instructions: '',
          plainLanguage: '',
          warnings: []
        };
        inMedicationSection = true;
      } else if (inMedicationSection && trimmedLine) {
        // Add content to the current medication's plain language explanation
        if (currentMed.plainLanguage) {
          currentMed.plainLanguage += ' ' + trimmedLine;
        } else {
          currentMed.plainLanguage = trimmedLine;
        }
      } else if (trimmedLine.toLowerCase().includes('important') || 
                 trimmedLine.toLowerCase().includes('warning') ||
                 trimmedLine.toLowerCase().includes('advice')) {
        generalInstructions.push(trimmedLine);
      }
    }
    
    // Add the last medication if exists
    if (currentMed.name) {
      medications.push(currentMed as MedicationInfo);
    }
    
    // If no structured medications found, create a general one
    if (medications.length === 0) {
      medications.push({
        name: 'Your Prescription',
        dosage: 'As prescribed',
        schedule: 'Follow doctor\'s instructions',
        instructions: 'Take as directed',
        plainLanguage: aiResponse,
        warnings: []
      });
    }
    
    return {
      medications,
      generalInstructions: generalInstructions.length > 0 ? generalInstructions : [
        'Take medications exactly as prescribed',
        'Complete the full course of treatment',
        'Contact your doctor if you have concerns'
      ]
    };
  };

  const processPrescription = async (input: string, type: 'text' | 'image') => {
    setCurrentStep('processing');
    setIsProcessing(true);
    setResults(null);
    setApiError(null);
    
    try {
      let prescriptionText = input;
      
      // If it's an image, extract text first
      if (type === 'image') {
        // For demo purposes, we'll use the input as-is
        // In a real implementation, you'd extract text from the uploaded image
        prescriptionText = input;
      }
      
      // Get AI response from OpenRouter
      const aiResponse = await OpenRouterAPI.decodePrescription(
        prescriptionText, 
        personalDetails, 
        medicalHistory
      );
      
      // Parse the AI response into structured data
      const parsedData = parseAIResponse(aiResponse);
      
      // Generate warnings based on medical history
      const medicalHistoryWarnings: string[] = [];
      if (medicalHistory) {
        if (medicalHistory.conditions.includes('Diabetes') || medicalHistory.conditions.includes('diabetes')) {
          const warning = language === 'hi' 
            ? '⚠️ आपको मधुमेह है - इन दवाओं को लेते समय रक्त शर्करा के स्तर की निगरानी करें'
            : language === 'bn'
            ? '⚠️ আপনার ডায়াবেটিস আছে - এই ওষুধ খাওয়ার সময় রক্তে শর্করার মাত্রা পর্যবেক্ষণ করুন'
            : '⚠️ You have diabetes - monitor blood sugar levels while taking these medications';
          medicalHistoryWarnings.push(warning);
        }
        if (medicalHistory.conditions.includes('Hypertension') || medicalHistory.conditions.includes('hypertension')) {
          const warning = language === 'hi'
            ? '⚠️ আপনার উচ্চ রক্তচাপ আছে - কিছু ওষুধ আপনার রক্তচাপকে প্রভাবিত করতে পারে'
            : language === 'bn'
            ? '⚠️ আপনার উচ্চ রক্তচাপ আছে - কিছু ওষুধ আপনার রক্তচাপকে প্রভাবিত করতে পারে'
            : '⚠️ You have high blood pressure - some medications may affect your blood pressure';
          medicalHistoryWarnings.push(warning);
        }
        if (medicalHistory.allergies.includes('Penicillin') || medicalHistory.allergies.includes('penicillin')) {
          const warning = language === 'hi'
            ? '🚨 एलर्जी अलर्ट: आपको पेनिसिलिन से एलर्जी है - सत्यापित करें कि यह नुस्खा आपके लिए सुरक्षित है'
            : language === 'bn'
            ? '🚨 অ্যালার্জি সতর্কতা: আপনার পেনিসিলিনে অ্যালার্জি আছে - যাচাই করুন এই প্রেসক্রিপশন আপনার জন্য নিরাপদ কিনা'
            : '🚨 ALLERGY ALERT: You are allergic to Penicillin - verify this prescription is safe for you';
          medicalHistoryWarnings.push(warning);
        }
        if (medicalHistory.currentMedications.length > 0) {
          const warning = language === 'hi'
            ? '💊 ড্রাগ ইন্টারঅ্যাকশন চেক প্রয়োজন - আপনি অন্যান্য ওষুধ সেবন করছেন'
            : language === 'bn'
            ? '💊 ড্রাগ ইন্টারঅ্যাকশন চেক প্রয়োজন - আপনি অন্যান্য ওষুধ সেবন করছেন'
            : '💊 Drug interaction check recommended - you are taking other medications';
          medicalHistoryWarnings.push(warning);
        }
      }

      // Generate personalized recommendations
      const personalizedRecommendations: Array<{
        type: 'dosage' | 'timing' | 'duration' | 'warning' | 'monitoring';
        message: string;
        severity: 'info' | 'warning' | 'critical';
      }> = [];

      // Add personalized intelligence to medications
      const enhancedMedications = parsedData.medications?.map(med => {
        if (personalDetails && medicalHistory) {
          const medRecommendations = MedicationIntelligence.generatePersonalizedRecommendations(
            med.name,
            personalDetails,
            medicalHistory
          );
          personalizedRecommendations.push(...medRecommendations);

          const personalizedDosage = MedicationIntelligence.calculatePersonalizedDosage(
            med.dosage,
            personalDetails
          );

          const timingRecommendations = MedicationIntelligence.generateTimingRecommendations(
            personalDetails,
            med.schedule
          );

          return {
            ...med,
            personalizedDosage,
            timingRecommendations
          };
        }
        return med;
      }) || [];

      // Generate follow-up tips
      const followUpTips = MedicationIntelligence.generateFollowUpTips(
        enhancedMedications,
        personalDetails,
        medicalHistory
      );

      const processedResults: ProcessedPrescription = {
        medications: translateMedications(enhancedMedications),
        medicalTerms: translateMedicalTerms([
          { term: "t.i.d", explanation: "Three times a day (Latin: ter in die) - typically morning, afternoon, and evening" },
          { term: "b.i.d", explanation: "Twice a day (Latin: bis in die) - usually morning and evening, 12 hours apart" },
          { term: "o.d", explanation: "Once a day (Latin: omni die) - take at the same time each day" },
          { term: "p.r.n", explanation: "As needed (Latin: pro re nata) - only take when you have symptoms" },
          { term: "SOS", explanation: "If necessary or as needed - similar to p.r.n, take only when required" }
        ], language),
        generalInstructions: translateGeneralInstructions(parsedData.generalInstructions || []),
        medicalHistoryWarnings,
        personalizedRecommendations,
        followUpTips,
        aiResponse
      };

      setResults(processedResults);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error processing prescription:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      // Show error state but allow retry
      setIsProcessing(false);
      // Don't change step, stay on input to allow retry
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setCurrentStep('personal');
    setPersonalDetails(null);
    setMedicalHistory(null);
    setResults(null);
    setIsProcessing(false);
    setApiError(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Controls - Fixed Position */}
        <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>

        <Header language={language} />
        
        <div className="space-y-12">
          {currentStep === 'personal' && (
            <PersonalDetailsForm onComplete={handlePersonalDetailsComplete} language={language} />
          )}

          {currentStep === 'history' && (
            <MedicalHistoryForm onComplete={handleMedicalHistoryComplete} language={language} personalDetails={personalDetails} />
          )}
          
          {currentStep === 'input' && (
            <>
              <InputSection onProcess={processPrescription} isProcessing={isProcessing} language={language} />
              
              {/* API Error Display */}
              {apiError && (
                <div className="glass-strong rounded-3xl p-6 shadow-strong dark:shadow-dark-strong border-l-4 border-red-500 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500 rounded-xl">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
                      Processing Error
                    </h3>
                  </div>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    {apiError}
                  </p>
                  <button
                    onClick={() => setApiError(null)}
                    className="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
          
          {currentStep === 'processing' && <LoadingState language={language} />}
          
          {currentStep === 'results' && results && (
            <>
              <ResultsSection results={results} personalDetails={personalDetails} language={language} />
              <div className="text-center">
                <button
                  onClick={resetApp}
                  className="py-3 px-8 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 font-semibold shadow-medium hover:shadow-strong transform hover:scale-105"
                >
                  {getTranslation('action.analyzeAnother', language)}
                </button>
              </div>
            </>
          )}
          
          <SecurityNotice language={language} />
        </div>
        
        <Footer language={language} />
      </div>
    </div>
  );
}

export default App;