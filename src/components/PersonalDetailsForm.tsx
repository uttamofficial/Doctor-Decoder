import React, { useState } from 'react';
import { User, Calendar, Weight, Users, ChevronRight, UserCheck, Ruler } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';

interface PersonalDetails {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
}

interface PersonalDetailsFormProps {
  onComplete: (data: PersonalDetails) => void;
  language: Language;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onComplete, language }) => {
  const [formData, setFormData] = useState<PersonalDetails>({
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    gender: 'male',
    weightUnit: 'kg',
    heightUnit: 'cm'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120 years)';
    }

    if (!formData.weight || formData.weight < 1 || formData.weight > 500) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.height || formData.height < 30 || formData.height > 300) {
      newErrors.height = 'Please enter a valid height (30-300 cm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const getAgeCategory = (age: number) => {
    if (age < 2) return 'Infant';
    if (age < 12) return 'Child';
    if (age < 18) return 'Adolescent';
    if (age < 65) return 'Adult';
    return 'Senior';
  };

  const calculateBMI = () => {
    if (formData.weight > 0 && formData.height > 0) {
      const heightInMeters = formData.height / 100;
      return formData.weight / (heightInMeters * heightInMeters);
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
    <div className="glass-strong rounded-3xl p-8 shadow-strong dark:shadow-dark-strong animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-medium">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {getTranslation('personal.title', language)}
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
          {getTranslation('personal.subtitle', language)}
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('personal.name', language)}</h3>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your first name"
              className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.name ? 'border-danger-500 focus:border-danger-500' : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
              }`}
            />
            {errors.name && (
              <p className="text-danger-600 dark:text-danger-400 text-sm font-medium">{errors.name}</p>
            )}
            {formData.name.trim() && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  Hello, {formData.name}! 👋
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Age Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('personal.age', language)}</h3>
          </div>
          
          <div className="space-y-3">
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              placeholder="Enter your age"
              className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.age ? 'border-danger-500 focus:border-danger-500' : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
              }`}
              min="1"
              max="120"
            />
            {errors.age && (
              <p className="text-danger-600 dark:text-danger-400 text-sm font-medium">{errors.age}</p>
            )}
            {formData.age > 0 && (
              <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-200 dark:border-primary-700">
                <p className="text-primary-700 dark:text-primary-300 font-medium">
                  Category: {getAgeCategory(formData.age)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weight and Height Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weight Input */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-success-500 to-success-600 rounded-xl">
                <Weight className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('personal.weight', language)}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter weight"
                  className={`flex-1 p-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.weight ? 'border-danger-500 focus:border-danger-500' : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                  }`}
                  min="1"
                  max="500"
                  step="0.1"
                />
                <div className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-lg">
                  kg
                </div>
              </div>
              {errors.weight && (
                <p className="text-danger-600 dark:text-danger-400 text-sm font-medium">{errors.weight}</p>
              )}
              {formData.weight > 0 && (
                <div className="p-3 bg-success-50 dark:bg-success-900/30 rounded-xl border border-success-200 dark:border-success-700">
                  <p className="text-success-700 dark:text-success-300 font-medium">
                    Weight: {formData.weight} kg
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Height Input */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <Ruler className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Height</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter height"
                  className={`flex-1 p-4 border-2 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-base placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.height ? 'border-danger-500 focus:border-danger-500' : 'border-gray-200 dark:border-gray-600 focus:border-primary-500'
                  }`}
                  min="30"
                  max="300"
                  step="0.1"
                />
                <div className="flex items-center px-4 py-4 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-lg">
                  cm
                </div>
              </div>
              {errors.height && (
                <p className="text-danger-600 dark:text-danger-400 text-sm font-medium">{errors.height}</p>
              )}
              {formData.height > 0 && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                  <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                    Height: {formData.height} cm
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BMI Display */}
        {bmi > 0 && (
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
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your BMI</h3>
            </div>
            
            <div className={`p-4 rounded-xl ${
              bmiInfo.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' :
              bmiInfo.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700' :
              'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${
                    bmiInfo.color === 'green' ? 'text-green-700 dark:text-green-300' :
                    bmiInfo.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                    'text-red-700 dark:text-red-300'
                  }`}>
                    {bmi.toFixed(1)}
                  </p>
                  <p className={`text-sm font-medium ${
                    bmiInfo.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    bmiInfo.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    BMI Category: {bmiInfo.category}
                  </p>
                </div>
                <div className={`text-3xl ${
                  bmiInfo.color === 'green' ? '✅' :
                  bmiInfo.color === 'yellow' ? '⚠️' : '🚨'
                }`}>
                  {bmiInfo.color === 'green' ? '✅' :
                   bmiInfo.color === 'yellow' ? '⚠️' : '🚨'}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                <p>BMI ranges: Underweight (&lt;18.5) • Normal (18.5-24.9) • Overweight (25-29.9) • Obese (≥30)</p>
              </div>
            </div>
          </div>
        )}

        {/* Gender Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft dark:shadow-dark-soft border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('personal.gender', language)}</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {(['male', 'female', 'other'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setFormData(prev => ({ ...prev, gender }))}
                className={`p-4 rounded-xl text-lg font-medium transition-all duration-300 border-2 capitalize ${
                  formData.gender === gender
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-300 hover:bg-purple-25 dark:hover:bg-purple-900/20'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Information Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Why we need this information:</h4>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
            <li>• Your name helps us personalize your medication guidance</li>
            <li>• Age helps determine appropriate dosages and timing</li>
            <li>• Weight and height affect medication dosage calculations</li>
            <li>• BMI helps assess health status and medication safety</li>
            <li>• Gender can influence drug metabolism and side effects</li>
            <li>• This ensures safer, more personalized recommendations</li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.age || !formData.weight || !formData.height}
            className="inline-flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105"
          >
            {getTranslation('personal.continue', language)}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;