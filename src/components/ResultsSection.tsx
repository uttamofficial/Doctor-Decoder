import React, { useState, useRef } from 'react';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Volume2, 
  Mail, 
  Info, 
  CheckCircle,
  Play,
  Pause,
  Shield,
  Brain,
  User,
  TrendingUp,
  Lightbulb,
  MessageCircleQuestion,
  AlertCircle,
  Heart,
  MessageCircle,
  Mic,
  Send,
  Bot,
  Calendar,
  FileText,
  Stethoscope,
  Loader2,
  X,
  Check
} from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';
import { EmailService } from '../utils/emailService';
import OpenRouterAPI from '../utils/openRouterAPI';

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

interface PersonalDetails {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
}

interface ResultsSectionProps {
  results: ProcessedPrescription;
  personalDetails?: PersonalDetails | null;
  language: Language;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

// Smart Calendar Component (Inline)
const SmartCalendarInline: React.FC<{ medications: MedicationInfo[]; personalName?: string; onClose: () => void }> = ({ 
  medications, 
  personalName = 'You',
  onClose 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState<Array<{ time: string; medication: string; dosage: string }>>([]);
  const [newReminderTime, setNewReminderTime] = useState('08:00');
  const [selectedMedication, setSelectedMedication] = useState(medications[0]?.name || '');

  const addReminder = () => {
    if (newReminderTime && selectedMedication) {
      const selectedMed = medications.find(med => med.name === selectedMedication);
      setReminders(prev => [...prev, {
        time: newReminderTime,
        medication: selectedMedication,
        dosage: selectedMed?.dosage || ''
      }]);
      setNewReminderTime('08:00');
    }
  };

  const removeReminder = (index: number) => {
    setReminders(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300">
              Smart Medication Scheduler
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
              Set up reminders for {personalName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-all duration-300 text-emerald-600 dark:text-emerald-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Add Reminder Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-emerald-200 dark:border-emerald-700">
        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4">Add New Reminder</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
            <input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medication</label>
            <select
              value={selectedMedication}
              onChange={(e) => setSelectedMedication(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {medications.map(med => (
                <option key={med.name} value={med.name}>{med.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={addReminder}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold"
            >
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Current Reminders */}
      <div className="space-y-3">
        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
          Today's Reminders ({reminders.length})
        </h4>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-emerald-300 dark:text-emerald-600" />
            <p>No reminders set yet</p>
            <p className="text-sm">Add your first reminder above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-emerald-800 dark:text-emerald-300">
                      {reminder.time} - {reminder.medication}
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      {reminder.dosage}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeReminder(index)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            alert(`${reminders.length} reminders saved for ${personalName}! (This is a demo)`);
            onClose();
          }}
          disabled={reminders.length === 0}
          className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
        >
          Save {reminders.length} Reminder{reminders.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

// Enhanced Email Reminder Component
const EmailReminderInline: React.FC<{ medications: MedicationInfo[]; personalName?: string; onClose: () => void }> = ({ 
  medications, 
  personalName = 'You',
  onClose 
}) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(medications[0]?.name || '');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [frequency, setFrequency] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showRecurring, setShowRecurring] = useState(false);

  const handleSetReminder = async () => {
    if (!emailAddress || !selectedMedication || !reminderTime) {
      setResult({
        success: false,
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const selectedMed = medications.find(med => med.name === selectedMedication);
      
      const reminderData = {
        email: emailAddress,
        medication: selectedMedication,
        dosage: selectedMed?.dosage || 'As prescribed',
        time: reminderTime,
        frequency: frequency,
        patientName: personalName
      };

      // Validate the data first
      const validation = EmailService.validateReminderData(reminderData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Send the email reminder
      const emailResult = await EmailService.sendReminderEmail(reminderData);
      
      if (emailResult.success && showRecurring) {
        // Set up recurring reminders if requested
        const recurringResult = await EmailService.setupRecurringReminders(reminderData);
        setResult({
          success: true,
          message: `${emailResult.message}\n\n${recurringResult.message}`
        });
      } else {
        setResult(emailResult);
      }

    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to set up email reminder'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      const testResult = await EmailService.testEmailService();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        message: 'Email service test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              Email Medication Reminders
            </h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Never miss a dose with email alerts for {personalName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 text-blue-600 dark:text-blue-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medication *
              </label>
              <select 
                value={selectedMedication}
                onChange={(e) => setSelectedMedication(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                {medications.map((med, index) => (
                  <option key={index} value={med.name}>{med.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reminder Time *
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isLoading}
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times-daily">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recurring Reminders Option */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showRecurring}
              onChange={(e) => setShowRecurring(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
            />
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-300">
                Set up recurring reminders
              </span>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Get instructions for setting up automatic recurring email reminders
              </p>
            </div>
          </label>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`mt-6 p-4 rounded-xl border ${
            result.success 
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.success 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 whitespace-pre-line ${
                  result.success 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            Close
          </button>
          <button
            onClick={handleTestEmail}
            className="py-3 px-6 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
          </button>
          <button
            onClick={handleSetReminder}
            disabled={!emailAddress || !selectedMedication || !reminderTime || isLoading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Set Email Reminder
              </>
            )}
          </button>
        </div>

        {/* Email Service Info */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📧 Email reminders will open your default email client. For production use, integrate with EmailJS, SendGrid, or similar service.
          </p>
        </div>
      </div>
    </div>
  );
};

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, personalDetails, language }) => {
  const [isReading, setIsReading] = useState(false);
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [showEmailReminder, setShowEmailReminder] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'chat'>('voice');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: `Hello ${personalDetails?.name || 'there'}! 👋 I'm MedBot, your personal health assistant powered by AI. I can help answer questions about your prescription, side effects, drug interactions, or general medication guidance. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Refs for auto-scrolling to popup sections
  const smartSchedulerRef = useRef<HTMLDivElement>(null);
  const emailReminderRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function
  const scrollToElement = (elementRef: React.RefObject<HTMLDivElement>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleVoiceReading = () => {
    setIsReading(true);
    
    if ('speechSynthesis' in window) {
      const textToRead = results.aiResponse || 
        results.medications.map(med => med.plainLanguage).join('. ');
      
      const greeting = personalDetails ? `Hello ${personalDetails.name}, here are your medication instructions. ` : '';
      const utterance = new SpeechSynthesisUtterance(greeting + textToRead);
      utterance.rate = 0.8;
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsReading(false), 3000);
    }
  };

  const handleSmartSchedulerToggle = () => {
    setShowSmartScheduler(!showSmartScheduler);
    
    // Auto-scroll to the scheduler after a brief delay to allow rendering
    if (!showSmartScheduler) {
      setTimeout(() => {
        scrollToElement(smartSchedulerRef);
      }, 100);
    }
  };

  const handleEmailReminderToggle = () => {
    setShowEmailReminder(!showEmailReminder);
    
    // Auto-scroll to the email reminder after a brief delay to allow rendering
    if (!showEmailReminder) {
      setTimeout(() => {
        scrollToElement(emailReminderRef);
      }, 100);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Get AI response from OpenRouter
      const botResponse = await OpenRouterAPI.getChatbotResponse(
        messageToSend,
        personalDetails,
        results.medications
      );

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: `I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or consult your healthcare provider for immediate assistance.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSeverityColor = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      default: return 'primary';
    }
  };

  const getSeverityIcon = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getTipTypeIcon = (type: 'question' | 'tip' | 'warning' | 'lifestyle') => {
    switch (type) {
      case 'question': return <MessageCircleQuestion className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'lifestyle': return <Heart className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTipTypeColor = (type: 'question' | 'tip' | 'warning' | 'lifestyle') => {
    switch (type) {
      case 'question': return 'blue';
      case 'warning': return 'warning';
      case 'lifestyle': return 'success';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Personal Profile Summary */}
      {personalDetails && (
        <div className="glass-strong rounded-3xl p-6 shadow-strong dark:shadow-dark-strong border-l-4 border-primary-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-300">
              {getTranslation('results.personalizedFor', language)} {personalDetails.name}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3 border border-primary-200 dark:border-primary-700">
              <span className="font-medium text-primary-700 dark:text-primary-300">{getTranslation('personal.name', language)}:</span> {personalDetails.name}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3 border border-primary-200 dark:border-primary-700">
              <span className="font-medium text-primary-700 dark:text-primary-300">{getTranslation('personal.age', language)}:</span> {personalDetails.age} years
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3 border border-primary-200 dark:border-primary-700">
              <span className="font-medium text-primary-700 dark:text-primary-300">{getTranslation('personal.weight', language)}:</span> {personalDetails.weight} {personalDetails.weightUnit}
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3 border border-primary-200 dark:border-primary-700">
              <span className="font-medium text-primary-700 dark:text-primary-300">{getTranslation('personal.gender', language)}:</span> {personalDetails.gender}
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Prescription Summary Card */}
      {results.aiResponse && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-950 dark:via-purple-900 dark:to-indigo-950 rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong border border-purple-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  AI-Decoded Prescription Summary
                </h3>
                <p className="text-purple-200 text-sm sm:text-base">Powered by advanced AI • Personalized for {personalDetails?.name || 'you'}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="prose prose-invert max-w-none">
                <div className="text-white leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {results.aiResponse}
                </div>
              </div>
            </div>

            {/* Quick Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-white">{results.medications.length}</div>
                <div className="text-purple-200 text-xs sm:text-sm">Medications</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {results.medications.filter(med => med.warnings && med.warnings.length > 0).length}
                </div>
                <div className="text-purple-200 text-xs sm:text-sm">Important Warnings</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {results.personalizedRecommendations?.length || 0}
                </div>
                <div className="text-purple-200 text-xs sm:text-sm">AI Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice + Chatbot Toggle Section */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong border-l-4 border-indigo-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-indigo-800 dark:text-indigo-300">
            {getTranslation('results.interactiveAssistant', language)}
          </h3>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
            🤖 AI-Powered
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 max-w-md">
          <button
            onClick={() => setActiveMode('voice')}
            className={`flex-1 py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
              activeMode === 'voice'
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-soft dark:shadow-dark-soft'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            {getTranslation('results.voiceAssistant', language)}
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
              activeMode === 'chat'
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-soft dark:shadow-dark-soft'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            {getTranslation('results.chatBot', language)}
          </button>
        </div>

        {/* Voice Mode */}
        {activeMode === 'voice' && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-700">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {isReading ? (
                  <div className="flex items-center gap-2">
                    <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                ) : (
                  <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                {personalDetails ? `${personalDetails.name}'s` : 'Your'} AI Prescription Audio
              </h4>
              <p className="text-indigo-600 dark:text-indigo-400 mb-6 text-sm sm:text-base">
                Listen to your AI-decoded prescription instructions read aloud in clear, simple language
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleVoiceReading}
                  disabled={isReading}
                  className="flex items-center gap-2 sm:gap-3 py-3 px-4 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 font-semibold shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105 text-sm sm:text-base"
                >
                  {isReading ? (
                    <>
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      Reading...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      {getTranslation('results.readPrescription', language)}
                    </>
                  )}
                </button>
                <button
                  onClick={handleSmartSchedulerToggle}
                  className="flex items-center gap-2 sm:gap-3 py-3 px-4 sm:px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105 text-sm sm:text-base"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  {getTranslation('results.smartScheduler', language)}
                </button>
                <button
                  onClick={handleEmailReminderToggle}
                  className="flex items-center gap-2 sm:gap-3 py-3 px-4 sm:px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105 text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  {getTranslation('results.emailReminders', language)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Mode */}
        {activeMode === 'chat' && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200 dark:border-blue-700 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">MedBot - AI Health Assistant</h4>
                  <p className="text-xs sm:text-sm opacity-90">Powered by advanced AI • Ask me anything about your prescription</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-60 sm:h-80 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                    <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500" />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">MedBot is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about side effects, timing, interactions..."
                  className="flex-1 p-2 sm:p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setCurrentMessage("What are the side effects?")}
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                  disabled={isTyping}
                >
                  Side effects?
                </button>
                <button
                  onClick={() => setCurrentMessage("Can I take this with food?")}
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                  disabled={isTyping}
                >
                  Take with food?
                </button>
                <button
                  onClick={() => setCurrentMessage("What if I miss a dose?")}
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                  disabled={isTyping}
                >
                  Missed dose?
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline Smart Calendar with ref for auto-scroll */}
      {showSmartScheduler && (
        <div ref={smartSchedulerRef}>
          <SmartCalendarInline
            medications={results.medications}
            personalName={personalDetails?.name}
            onClose={() => setShowSmartScheduler(false)}
          />
        </div>
      )}

      {/* Enhanced Email Reminder with ref for auto-scroll */}
      {showEmailReminder && (
        <div ref={emailReminderRef}>
          <EmailReminderInline
            medications={results.medications}
            personalName={personalDetails?.name}
            onClose={() => setShowEmailReminder(false)}
          />
        </div>
      )}

      {/* What You Should Know Section */}
      {results.followUpTips && results.followUpTips.length > 0 && (
        <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-indigo-800 dark:text-indigo-300">
              {getTranslation('results.followUpTips', language)}
            </h3>
          </div>
          <p className="text-indigo-600 dark:text-indigo-400 mb-6 font-medium text-sm sm:text-base">
            Based on your prescription and profile, here are important follow-up tips and questions:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {results.followUpTips.map((tip, index) => {
              const colorClass = getTipTypeColor(tip.type);
              return (
                <div key={index} className={`bg-${colorClass}-50 dark:bg-${colorClass}-900/30 rounded-2xl p-4 sm:p-6 border border-${colorClass}-200 dark:border-${colorClass}-700 hover:shadow-medium dark:hover:shadow-dark-medium transition-all duration-300`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 bg-gradient-to-br from-${colorClass}-500 to-${colorClass}-600 rounded-xl flex-shrink-0`}>
                      <div className="text-white">
                        {getTipTypeIcon(tip.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold text-${colorClass}-800 dark:text-${colorClass}-300 text-sm sm:text-base`}>{tip.title}</h4>
                        <span className="text-base sm:text-lg">{tip.icon}</span>
                        {tip.priority === 'high' && (
                          <span className="bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 text-xs font-bold px-2 py-1 rounded-full">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <p className={`text-${colorClass}-700 dark:text-${colorClass}-300 leading-relaxed text-sm sm:text-base`}>{tip.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personalized AI Recommendations */}
      {results.personalizedRecommendations && results.personalizedRecommendations.length > 0 && (
        <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-800 dark:text-purple-300">
              {getTranslation('results.aiRecommendations', language)}
              {personalDetails && ` for ${personalDetails.name}`}
            </h3>
          </div>
          <div className="space-y-4">
            {results.personalizedRecommendations.map((rec, index) => {
              const colorClass = getSeverityColor(rec.severity);
              return (
                <div key={index} className={`flex items-start gap-3 p-4 bg-${colorClass}-50 dark:bg-${colorClass}-900/30 rounded-xl border border-${colorClass}-200 dark:border-${colorClass}-700`}>
                  <span className="text-base sm:text-lg">{getSeverityIcon(rec.severity)}</span>
                  <div className="flex-1">
                    <div className={`text-xs font-semibold text-${colorClass}-600 dark:text-${colorClass}-400 uppercase tracking-wide mb-1`}>
                      {rec.type}
                    </div>
                    <p className={`text-${colorClass}-800 dark:text-${colorClass}-300 font-medium leading-relaxed text-sm sm:text-base`}>{rec.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medical History Warnings */}
      {results.medicalHistoryWarnings && results.medicalHistoryWarnings.length > 0 && (
        <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong border-l-4 border-warning-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-warning-800 dark:text-warning-300">
              {getTranslation('results.medicalAlerts', language)}
              {personalDetails && ` for ${personalDetails.name}`}
            </h3>
          </div>
          <div className="space-y-3">
            {results.medicalHistoryWarnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-warning-50 dark:bg-warning-900/30 rounded-xl border border-warning-200 dark:border-warning-700">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                <p className="text-warning-800 dark:text-warning-300 font-medium text-sm sm:text-base">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <Pill className="w-6 h-6 text-white" />
          </div>
          {personalDetails ? `${personalDetails.name}'s ${getTranslation('results.medications', language)}` : getTranslation('results.medications', language)}
        </h3>
        <div className="space-y-6">
          {results.medications.map((med, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-soft dark:shadow-dark-soft hover:shadow-medium dark:hover:shadow-dark-medium transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <h4 className="text-lg sm:text-xl font-semibold text-primary-700 dark:text-primary-400">{med.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 w-fit">
                  <Clock className="w-4 h-4" />
                  {med.schedule}
                </div>
              </div>

              {/* Personalized Dosage */}
              {med.personalizedDosage && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-4 mb-4 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-purple-700 dark:text-purple-300 font-semibold text-sm">{getTranslation('medication.personalizedDosage', language)}</p>
                  </div>
                  <p className="text-purple-800 dark:text-purple-300 font-medium text-sm sm:text-base">{med.personalizedDosage}</p>
                </div>
              )}

              {/* Timing Recommendations */}
              {med.timingRecommendations && med.timingRecommendations.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{getTranslation('medication.personalizedTiming', language)}</p>
                  </div>
                  <ul className="text-blue-800 dark:text-blue-300 space-y-1">
                    {med.timingRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">{getTranslation('medication.simpleTerms', language)}</p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base">{med.plainLanguage}</p>
              </div>
              {med.warnings && (
                <div className="flex items-start gap-3 p-4 bg-warning-50 dark:bg-warning-900/30 rounded-xl border border-warning-200 dark:border-warning-700">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-warning-800 dark:text-warning-300 mb-2 text-sm sm:text-base">{getTranslation('medication.warnings', language)}</p>
                    <ul className="text-warning-700 dark:text-warning-300 space-y-1">
                      {med.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                          <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mt-2 flex-shrink-0"></span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medical Terms */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <Info className="w-6 h-6 text-white" />
          </div>
          {getTranslation('results.medicalTerms', language)}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {results.medicalTerms.map((term, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-soft dark:shadow-dark-soft hover:shadow-medium dark:hover:shadow-dark-medium transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="font-semibold text-primary-700 dark:text-primary-400 text-base sm:text-lg mb-2">{term.term}</div>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{term.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* General Instructions */}
      <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-strong dark:shadow-dark-strong">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-success-500 to-success-600 rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          {getTranslation('results.generalInstructions', language)}
        </h3>
        <ul className="space-y-4">
          {results.generalInstructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft dark:shadow-dark-soft">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{instruction}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsSection;