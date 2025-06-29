interface TranslationData {
  [key: string]: {
    en: string;
    hi: string;
    bn: string;
  };
}

export type Language = 'en' | 'hi' | 'bn';

export const translations: TranslationData = {
  // Header and Navigation
  'app.title': {
    en: 'Doctor Decoder',
    hi: 'डॉक्टर डिकोडर',
    bn: 'ডক্টর ডিকোডার'
  },
  'app.subtitle': {
    en: 'Decode your prescriptions. Understand your care.',
    hi: 'अपने नुस्खे को समझें। अपनी देखभाल को समझें।',
    bn: 'আপনার প্রেসক্রিপশন বুঝুন। আপনার যত্ন বুঝুন।'
  },
  'language.english': {
    en: 'English',
    hi: 'अंग्रेजी',
    bn: 'ইংরেজি'
  },
  'language.hindi': {
    en: 'Hindi',
    hi: 'हिंदी',
    bn: 'হিন্দি'
  },
  'language.bengali': {
    en: 'Bengali',
    hi: 'बंगाली',
    bn: 'বাংলা'
  },

  // Personal Details Form
  'personal.title': {
    en: 'Personal Details',
    hi: 'व्यक्तिगत विवरण',
    bn: 'ব্যক্তিগত বিবরণ'
  },
  'personal.subtitle': {
    en: 'We need some basic information to provide personalized medication guidance',
    hi: 'व्यक्तिगत दवा मार्गदर्शन प्रदान करने के लिए हमें कुछ बुनियादी जानकारी चाहिए',
    bn: 'ব্যক্তিগতকৃত ওষুধের নির্দেশনা প্রদানের জন্য আমাদের কিছু মৌলিক তথ্য প্রয়োজন'
  },
  'personal.name': {
    en: 'Your Name',
    hi: 'आपका नाम',
    bn: 'আপনার নাম'
  },
  'personal.age': {
    en: 'Age',
    hi: 'आयु',
    bn: 'বয়স'
  },
  'personal.weight': {
    en: 'Weight',
    hi: 'वजन',
    bn: 'ওজন'
  },
  'personal.gender': {
    en: 'Gender',
    hi: 'लिंग',
    bn: 'লিঙ্গ'
  },
  'personal.continue': {
    en: 'Continue to Medical History',
    hi: 'चिकित्सा इतिहास पर जारी रखें',
    bn: 'চিকিৎসা ইতিহাসে চালিয়ে যান'
  },

  // Medical History Form
  'history.title': {
    en: 'Medical History',
    hi: 'चिकित्सा इतिहास',
    bn: 'চিকিৎসা ইতিহাস'
  },
  'history.subtitle': {
    en: 'Help us provide better prescription analysis by sharing your medical background',
    hi: 'अपनी चिकित्सा पृष्ठभूमि साझा करके बेहतर नुस्खा विश्लेषण प्रदान करने में हमारी सहायता करें',
    bn: 'আপনার চিকিৎসা পটভূমি শেয়ার করে আরও ভাল প্রেসক্রিপশন বিশ্লেষণ প্রদান করতে আমাদের সাহায্য করুন'
  },
  'history.conditions': {
    en: 'Existing Medical Conditions',
    hi: 'मौजूदा चिकित्सा स्थितियां',
    bn: 'বিদ্যমান চিকিৎসা অবস্থা'
  },
  'history.allergies': {
    en: 'Known Allergies',
    hi: 'ज्ञात एलर्जी',
    bn: 'পরিচিত অ্যালার্জি'
  },
  'history.medications': {
    en: 'Current Medications',
    hi: 'वर्तमान दवाएं',
    bn: 'বর্তমান ওষুধ'
  },
  'history.notes': {
    en: 'Additional Notes',
    hi: 'अतिरिक्त टिप्पणियां',
    bn: 'অতিরিক্ত নোট'
  },
  'history.continue': {
    en: 'Continue to Prescription Upload',
    hi: 'प्रिस्क्रिप्शन अपलोड पर जारी रखें',
    bn: 'প্রেসক্রিপশন আপলোডে চালিয়ে যান'
  },

  // Input Section
  'input.title': {
    en: 'Upload Your Prescription',
    hi: 'अपना नुस्खा अपलोड करें',
    bn: 'আপনার প্রেসক্রিপশন আপলোড করুন'
  },
  'input.text': {
    en: 'Paste Text',
    hi: 'टेक्स्ट पेस्ट करें',
    bn: 'টেক্সট পেস্ট করুন'
  },
  'input.image': {
    en: 'Upload Image',
    hi: 'छवि अपलोड करें',
    bn: 'ছবি আপলোড করুন'
  },
  'input.decode': {
    en: 'Decode Prescription',
    hi: 'नुस्खा डिकोड करें',
    bn: 'প্রেসক্রিপশন ডিকোড করুন'
  },
  'input.decoding': {
    en: 'Decoding...',
    hi: 'डिकोड हो रहा है...',
    bn: 'ডিকোড হচ্ছে...'
  },

  // Loading State
  'loading.title': {
    en: 'Analyzing Your Prescription',
    hi: 'आपके नुस्खे का विश्लेषण',
    bn: 'আপনার প্রেসক্রিপশন বিশ্লেষণ করা হচ্ছে'
  },
  'loading.subtitle': {
    en: 'Our AI is carefully reading and translating your prescription into simple, understandable language...',
    hi: 'हमारा AI आपके नुस्खे को सावधानीपूर्वक पढ़ रहा है और सरल, समझने योग्य भाषा में अनुवाद कर रहा है...',
    bn: 'আমাদের AI সাবধানে আপনার প্রেসক্রিপশন পড়ছে এবং সহজ, বোধগম্য ভাষায় অনুবাদ করছে...'
  },

  // Results Section
  'results.personalizedFor': {
    en: 'Personalized for',
    hi: 'के लिए व्यक्तिगत',
    bn: 'এর জন্য ব্যক্তিগতকৃত'
  },
  'results.medications': {
    en: 'Your Medications',
    hi: 'आपकी दवाएं',
    bn: 'আপনার ওষুধ'
  },
  'results.medicalTerms': {
    en: 'Medical Terms Explained',
    hi: 'चिकित्सा शब्दों की व्याख्या',
    bn: 'চিকিৎসা পরিভাষা ব্যাখ্যা'
  },
  'results.generalInstructions': {
    en: 'General Instructions',
    hi: 'सामान्य निर्देश',
    bn: 'সাধারণ নির্দেশাবলী'
  },
  'results.aiRecommendations': {
    en: 'AI-Powered Personal Recommendations',
    hi: 'AI-संचालित व्यक्तिगत सिफारिशें',
    bn: 'AI-চালিত ব্যক্তিগত সুপারিশ'
  },
  'results.medicalAlerts': {
    en: 'Medical History Alerts',
    hi: 'चिकित्सा इतिहास अलर्ट',
    bn: 'চিকিৎসা ইতিহাস সতর্কতা'
  },
  'results.followUpTips': {
    en: 'What You Should Know',
    hi: 'आपको क्या जानना चाहिए',
    bn: 'আপনার যা জানা উচিত'
  },
  'results.interactiveAssistant': {
    en: 'Interactive Health Assistant',
    hi: 'इंटरैक्टिव स्वास्थ्य सहायक',
    bn: 'ইন্টারঅ্যাক্টিভ স্বাস্থ্য সহায়ক'
  },
  'results.voiceAssistant': {
    en: 'Voice Assistant',
    hi: 'वॉयस असिस्टेंट',
    bn: 'ভয়েস সহায়ক'
  },
  'results.chatBot': {
    en: 'MedBot Chat',
    hi: 'मेडबॉट चैट',
    bn: 'মেডবট চ্যাট'
  },
  'results.readPrescription': {
    en: '🔊 Read My Prescription',
    hi: '🔊 मेरा नुस्खा पढ़ें',
    bn: '🔊 আমার প্রেসক্রিপশন পড়ুন'
  },
  'results.smartScheduler': {
    en: '📅 Smart Scheduler',
    hi: '📅 स्मार्ट शेड्यूलर',
    bn: '📅 স্মার্ট শিডিউলার'
  },
  'results.emailReminders': {
    en: 'Email Reminders',
    hi: 'ईमेल रिमाइंडर',
    bn: 'ইমেইল রিমাইন্ডার'
  },

  // Medication Information
  'medication.simpleTerms': {
    en: 'In Simple Terms:',
    hi: 'सरल शब्दों में:',
    bn: 'সহজ ভাষায়:'
  },
  'medication.warnings': {
    en: 'Important Warnings:',
    hi: 'महत्वपूर्ण चेतावनी:',
    bn: 'গুরুত্বপূর্ণ সতর্কতা:'
  },
  'medication.personalizedDosage': {
    en: 'Personalized Dosage Guidance:',
    hi: 'व्यक्तिगत खुराक मार्गदर्शन:',
    bn: 'ব্যক্তিগতকৃত ডোজ নির্দেশনা:'
  },
  'medication.personalizedTiming': {
    en: 'Personalized Timing:',
    hi: 'व्यक्तिगत समय:',
    bn: 'ব্যক্তিগতকৃত সময়:'
  },

  // Common Actions
  'action.add': {
    en: 'Add',
    hi: 'जोड़ें',
    bn: 'যোগ করুন'
  },
  'action.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    bn: 'বাতিল করুন'
  },
  'action.save': {
    en: 'Save',
    hi: 'सेव करें',
    bn: 'সংরক্ষণ করুন'
  },
  'action.close': {
    en: 'Close',
    hi: 'बंद करें',
    bn: 'বন্ধ করুন'
  },
  'action.continue': {
    en: 'Continue',
    hi: 'जारी रखें',
    bn: 'চালিয়ে যান'
  },
  'action.analyzeAnother': {
    en: 'Analyze Another Prescription',
    hi: 'दूसरे नुस्खे का विश्लेषण करें',
    bn: 'অন্য প্রেসক্রিপশন বিশ্লেষণ করুন'
  },

  // Security Notice
  'security.title': {
    en: '100% Secure & Private',
    hi: '100% सुरक्षित और निजी',
    bn: '১০০% নিরাপদ এবং ব্যক্তিগত'
  },
  'security.subtitle': {
    en: 'Your data is not stored',
    hi: 'आपका डेटा संग्रहीत नहीं है',
    bn: 'আপনার ডেটা সংরক্ষিত হয় না'
  },
  'security.description': {
    en: 'Your prescription data is processed securely using advanced encryption and is never stored on our servers. All information is deleted immediately after processing to ensure your complete privacy and security.',
    hi: 'आपके नुस्खे का डेटा उन्नत एन्क्रिप्शन का उपयोग करके सुरक्षित रूप से संसाधित किया जाता है और कभी भी हमारे सर्वर पर संग्रहीत नहीं किया जाता है। आपकी पूर्ण गोपनीयता और सुरक्षा सुनिश्चित करने के लिए सभी जानकारी प्रसंस्करण के तुरंत बाद हटा दी जाती है।',
    bn: 'আপনার প্রেসক্রিপশন ডেটা উন্নত এনক্রিপশন ব্যবহার করে নিরাপদে প্রক্রিয়া করা হয় এবং কখনও আমাদের সার্ভারে সংরক্ষণ করা হয় না। আপনার সম্পূর্ণ গোপনীয়তা এবং নিরাপত্তা নিশ্চিত করতে সমস্ত তথ্য প্রক্রিয়াকরণের পরে অবিলম্বে মুছে ফেলা হয়।'
  },

  // Footer
  'footer.about': {
    en: 'About',
    hi: 'के बारे में',
    bn: 'সম্পর্কে'
  },
  'footer.privacy': {
    en: 'Privacy',
    hi: 'गोपनीयता',
    bn: 'গোপনীয়তা'
  },
  'footer.help': {
    en: 'Help',
    hi: 'सहायता',
    bn: 'সাহায্য'
  },
  'footer.copyright': {
    en: '© 2025 Doctor Decoder. Making healthcare accessible to everyone.',
    hi: '© 2025 डॉक्टर डिकोडर। सभी के लिए स्वास्थ्य सेवा को सुलभ बनाना।',
    bn: '© ২০২৫ ডক্টর ডিকোডার। সবার জন্য স্বাস্থ্যসেবা সহজলভ্য করা।'
  },
  'footer.secure': {
    en: '100% secure – your data is not stored',
    hi: '100% सुरक्षित – आपका डेटा संग्रहीत नहीं है',
    bn: '১০০% নিরাপদ – আপনার ডেটা সংরক্ষিত হয় না'
  },
  'footer.builtWith': {
    en: 'Built with Bolt.new',
    hi: 'Bolt.new के साथ निर्मित',
    bn: 'Bolt.new দিয়ে তৈরি'
  }
};

// Sample medication translations
export const medicationTranslations = {
  // Medication names (keeping English names but adding local context)
  'Amoxicillin 500mg': {
    en: 'Amoxicillin 500mg',
    hi: 'एमोक्सिसिलिन 500mg',
    bn: 'অ্যামক্সিসিলিন ৫০০মিগ্রা'
  },
  'Ibuprofen 400mg': {
    en: 'Ibuprofen 400mg',
    hi: 'इबुप्रोफेन 400mg',
    bn: 'আইবুপ্রোফেন ৪০০মিগ্রা'
  },
  'Omeprazole 20mg': {
    en: 'Omeprazole 20mg',
    hi: 'ओमेप्राजोल 20mg',
    bn: 'ওমেপ্রাজল ২০মিগ্রা'
  },

  // Dosage instructions
  't.i.d (3 times daily)': {
    en: 't.i.d (3 times daily)',
    hi: 't.i.d (दिन में 3 बार)',
    bn: 't.i.d (দিনে ৩ বার)'
  },
  'b.i.d p.r.n (twice daily as needed)': {
    en: 'b.i.d p.r.n (twice daily as needed)',
    hi: 'b.i.d p.r.n (आवश्यकतानुसार दिन में दो बार)',
    bn: 'b.i.d p.r.n (প্রয়োজন অনুযায়ী দিনে দুইবার)'
  },
  'o.d (once daily)': {
    en: 'o.d (once daily)',
    hi: 'o.d (दिन में एक बार)',
    bn: 'o.d (দিনে একবার)'
  },

  // Instructions
  'Take with food': {
    en: 'Take with food',
    hi: 'भोजन के साथ लें',
    bn: 'খাবারের সাথে নিন'
  },
  'Take before breakfast': {
    en: 'Take before breakfast',
    hi: 'नाश्ते से पहले लें',
    bn: 'নাস্তার আগে নিন'
  },
  'Take with food, maximum 3 days': {
    en: 'Take with food, maximum 3 days',
    hi: 'भोजन के साथ लें, अधिकतम 3 दिन',
    bn: 'খাবারের সাথে নিন, সর্বোচ্চ ৩ দিন'
  },

  // Plain language explanations
  'Take one 500mg capsule three times a day with meals for the full prescribed period, even if you start feeling better before finishing all the pills.': {
    en: 'Take one 500mg capsule three times a day with meals for the full prescribed period, even if you start feeling better before finishing all the pills.',
    hi: 'भोजन के साथ दिन में तीन बार एक 500mg कैप्सूल लें, निर्धारित अवधि के लिए, भले ही आप सभी गोलियां समाप्त करने से पहले बेहतर महसूस करने लगें।',
    bn: 'খাবারের সাথে দিনে তিনবার একটি ৫০০মিগ্রা ক্যাপসুল নিন নির্ধারিত সময়ের জন্য, এমনকি সব বড়ি শেষ করার আগে ভাল লাগলেও।'
  },
  'Take one 400mg tablet twice a day with food only when you have pain or inflammation. Don\'t use for more than 3 days without consulting your doctor.': {
    en: 'Take one 400mg tablet twice a day with food only when you have pain or inflammation. Don\'t use for more than 3 days without consulting your doctor.',
    hi: 'दर्द या सूजन होने पर ही भोजन के साथ दिन में दो बार एक 400mg टैबलेट लें। अपने डॉक्टर से सलाह लिए बिना 3 दिन से अधिक उपयोग न करें।',
    bn: 'ব্যথা বা প্রদাহ থাকলেই খাবারের সাথে দিনে দুইবার একটি ৪০০মিগ্রা ট্যাবলেট নিন। ডাক্তারের পরামর্শ ছাড়া ৩ দিনের বেশি ব্যবহার করবেন না।'
  },
  'Take one 20mg capsule every morning before eating breakfast to reduce stomach acid production.': {
    en: 'Take one 20mg capsule every morning before eating breakfast to reduce stomach acid production.',
    hi: 'पेट में एसिड का उत्पादन कम करने के लिए हर सुबह नाश्ते से पहले एक 20mg कैप्सूल लें।',
    bn: 'পেটের অ্যাসিড উৎপাদন কমাতে প্রতিদিন সকালে নাস্তার আগে একটি ২০মিগ্রা ক্যাপসুল নিন।'
  },

  // Warnings
  'Complete full course even if feeling better': {
    en: 'Complete full course even if feeling better',
    hi: 'बेहतर महसूस करने पर भी पूरा कोर्स पूरा करें',
    bn: 'ভাল লাগলেও সম্পূর্ণ কোর্স সম্পন্ন করুন'
  },
  'May cause stomach upset or diarrhea': {
    en: 'May cause stomach upset or diarrhea',
    hi: 'पेट खराब या दस्त हो सकते हैं',
    bn: 'পেট খারাপ বা ডায়রিয়া হতে পারে'
  },
  'Do not exceed recommended dose': {
    en: 'Do not exceed recommended dose',
    hi: 'सुझाई गई खुराक से अधिक न लें',
    bn: 'প্রস্তাবিত ডোজের বেশি নেবেন না'
  },
  'Avoid if you have stomach ulcers': {
    en: 'Avoid if you have stomach ulcers',
    hi: 'यदि आपको पेट में अल्सर है तो बचें',
    bn: 'পেটে আলসার থাকলে এড়িয়ে চলুন'
  }
};

export const getTranslation = (key: string, language: Language): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  return translation[language] || translation.en || key;
};

export const getMedicationTranslation = (text: string, language: Language): string => {
  const translation = medicationTranslations[text as keyof typeof medicationTranslations];
  if (!translation) {
    return text; // Return original text if no translation found
  }
  return translation[language] || translation.en || text;
};

// Helper function to translate arrays of text
export const translateArray = (items: string[], language: Language, isMedication = false): string[] => {
  return items.map(item => 
    isMedication ? getMedicationTranslation(item, language) : getTranslation(item, language)
  );
};

// Helper function to translate medical terms
export const translateMedicalTerms = (terms: { term: string; explanation: string; }[], language: Language) => {
  const termTranslations = {
    't.i.d': {
      en: { term: 't.i.d', explanation: 'Three times a day (Latin: ter in die) - typically morning, afternoon, and evening' },
      hi: { term: 't.i.d', explanation: 'दिन में तीन बार (लैटिन: ter in die) - आमतौर पर सुबह, दोपहर और शाम' },
      bn: { term: 't.i.d', explanation: 'দিনে তিনবার (ল্যাটিন: ter in die) - সাধারণত সকাল, দুপুর এবং সন্ধ্যা' }
    },
    'b.i.d': {
      en: { term: 'b.i.d', explanation: 'Twice a day (Latin: bis in die) - usually morning and evening, 12 hours apart' },
      hi: { term: 'b.i.d', explanation: 'दिन में दो बार (लैटिन: bis in die) - आमतौर पर सुबह और शाम, 12 घंटे के अंतराल पर' },
      bn: { term: 'b.i.d', explanation: 'দিনে দুইবার (ল্যাটিন: bis in die) - সাধারণত সকাল এবং সন্ধ্যা, ১২ ঘন্টা ব্যবধানে' }
    },
    'o.d': {
      en: { term: 'o.d', explanation: 'Once a day (Latin: omni die) - take at the same time each day' },
      hi: { term: 'o.d', explanation: 'दिन में एक बार (लैटिन: omni die) - हर दिन एक ही समय पर लें' },
      bn: { term: 'o.d', explanation: 'দিনে একবার (ল্যাটিন: omni die) - প্রতিদিন একই সময়ে নিন' }
    },
    'p.r.n': {
      en: { term: 'p.r.n', explanation: 'As needed (Latin: pro re nata) - only take when you have symptoms' },
      hi: { term: 'p.r.n', explanation: 'आवश्यकतानुसार (लैटिन: pro re nata) - केवल तभी लें जब आपको लक्षण हों' },
      bn: { term: 'p.r.n', explanation: 'প্রয়োজন অনুযায়ী (ল্যাটিন: pro re nata) - শুধুমাত্র লক্ষণ থাকলে নিন' }
    },
    'SOS': {
      en: { term: 'SOS', explanation: 'If necessary or as needed - similar to p.r.n, take only when required' },
      hi: { term: 'SOS', explanation: 'यदि आवश्यक हो या आवश्यकतानुसार - p.r.n के समान, केवल आवश्यक होने पर लें' },
      bn: { term: 'SOS', explanation: 'প্রয়োজনে বা প্রয়োজন অনুযায়ী - p.r.n এর মতো, শুধুমাত্র প্রয়োজনে নিন' }
    }
  };

  return terms.map(term => {
    const translation = termTranslations[term.term as keyof typeof termTranslations];
    return translation ? translation[language] : term;
  });
};