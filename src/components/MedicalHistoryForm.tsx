import React, { useState } from 'react';
import { Heart, AlertCircle, Pill, ChevronRight, User, Activity } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';

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

interface MedicalHistoryFormProps {
  onComplete: (data: MedicalHistoryData) => void;
  language: Language;
  personalDetails?: PersonalDetails | null;
}

const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({ onComplete, language, personalDetails }) => {
  const [formData, setFormData] = useState<MedicalHistoryData>({
    conditions: [],
    allergies: [],
    currentMedications: [],
    additionalNotes: ''
  });

  const [customCondition, setCustomCondition] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [customMedication, setCustomMedication] = useState('');

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis',
    'High Cholesterol', 'Depression', 'Anxiety', 'Thyroid Disorder',
    'Kidney Disease', 'Liver Disease', 'COPD'
  ];

  const commonAllergies = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine',
    'Latex', 'Shellfish', 'Nuts', 'Eggs', 'Dairy', 'Pollen', 'Dust'
  ];

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleAllergyToggle = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !formData.conditions.includes(customCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, customCondition.trim()]
      }));
      setCustomCondition('');
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    }
  };

  const addCustomMedication = () => {
    if (customMedication.trim() && !formData.currentMedications.includes(customMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, customMedication.trim()]
      }));
      setCustomMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(m => m !== medication)
    }));
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  // Calculate BMI if personal details are available
  const calculateBMI = () => {
    if (personalDetails && personalDetails.weight > 0 && personalDetails.height > 0) {
      const heightInMeters = personalDetails.height / 100;
      return personalDetails.weight / (heightInMeters * heightInMeters);
    }
    return 0;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'yellow' };
    if (bmi < 25) return { category: 'Normal', color: 'green' };
    if (bmi < 30) return { category: 'Overweight', color: 'yellow' };
    return { category: 'Obese', color: 'red' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="glass-strong rounded-3xl p-8 shadow-strong dark:shadow-dark-strong animate-slide-up max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-medium">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {getTranslation('history.title', language)}
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
          {getTranslation('history.subtitle', language)}
        </p>
      </div>

      <div className="space-y-8">
        {/* BMI Summary Card */}
        {personalDetails && bmi > 0 && (
          <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border transition-all duration-300 ${
            bmiInfo.color === 'green' ? 'border-green-200 dark:border-green-700' :
            bmiInfo.color === 'yellow' ? 'border-yellow-200 dark:border-yellow-700' :
            'border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${
                bmiInfo.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                bmiInfo.color === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {personalDetails.name}'s Health Profile
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Personal Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Age:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{personalDetails.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{personalDetails.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Height:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{personalDetails.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{personalDetails.gender}</span>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${
                bmiInfo.color === 'green' ? 'bg-green-50 dark:bg-green-900/30' :
                bmiInfo.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/30' :
                'bg-red-50 dark:bg-red-900/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    bmiInfo.color === 'green' ? 'text-green-700 dark:text-green-300' :
                    bmiInfo.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                    'text-red-700 dark:text-red-300'
                  }`}>
                    BMI Analysis
                  </h4>
                  <div className="text-2xl">
                    {bmiInfo.color === 'green' ? '✅' :
                     bmiInfo.color === 'yellow' ? '⚠️' : '🚨'}
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  bmiInfo.color === 'green' ? 'text-green-700 dark:text-green-300' :
                  bmiInfo.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-red-700 dark:text-red-300'
                }`}>
                  {bmi.toFixed(1)}
                </div>
                <div className={`text-sm font-medium ${
                  bmiInfo.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  bmiInfo.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {bmiInfo.category}
                </div>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  This may affect medication dosing
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Medical Conditions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-danger-500 to-danger-600 rounded-xl">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('history.conditions', language)}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {commonConditions.map((condition) => (
              <button
                key={condition}
                onClick={() => handleConditionToggle(condition)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                  formData.conditions.includes(condition)
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-25 dark:hover:bg-primary-900/20'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              placeholder="Add other condition..."
              className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && addCustomCondition()}
            />
            <button
              onClick={addCustomCondition}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold"
            >
              {getTranslation('action.add', language)}
            </button>
          </div>

          {formData.conditions.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              Select any conditions that apply to you, or choose "None" if you have no known conditions
            </p>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('history.allergies', language)}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleAllergyToggle(allergy)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                  formData.allergies.includes(allergy)
                    ? 'bg-warning-50 dark:bg-warning-900/30 border-warning-500 text-warning-700 dark:text-warning-300'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-warning-300 hover:bg-warning-25 dark:hover:bg-warning-900/20'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              placeholder="Add other allergy..."
              className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
            />
            <button
              onClick={addCustomAllergy}
              className="px-6 py-3 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl hover:from-warning-600 hover:to-warning-700 transition-all duration-300 font-semibold"
            >
              {getTranslation('action.add', language)}
            </button>
          </div>

          {formData.allergies.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              Select any known allergies, or leave blank if you have none
            </p>
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-success-500 to-success-600 rounded-xl">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('history.medications', language)}</h3>
          </div>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customMedication}
              onChange={(e) => setCustomMedication(e.target.value)}
              placeholder="Enter medication name and dosage..."
              className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && addCustomMedication()}
            />
            <button
              onClick={addCustomMedication}
              className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl hover:from-success-600 hover:to-success-700 transition-all duration-300 font-semibold"
            >
              {getTranslation('action.add', language)}
            </button>
          </div>

          {formData.currentMedications.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.currentMedications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/30 rounded-xl border border-success-200 dark:border-success-700">
                  <span className="text-success-800 dark:text-success-300 font-medium">{medication}</span>
                  <button
                    onClick={() => removeMedication(medication)}
                    className="text-success-600 dark:text-success-400 hover:text-success-800 dark:hover:text-success-200 transition-colors duration-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.currentMedications.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              List any medications you're currently taking, including over-the-counter drugs and supplements
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{getTranslation('history.notes', language)}</h3>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="Any other relevant medical information, recent surgeries, or concerns..."
            className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold text-lg shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105"
          >
            {getTranslation('history.continue', language)}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryForm;