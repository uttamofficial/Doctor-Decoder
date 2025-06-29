import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';

interface SecurityNoticeProps {
  language: Language;
}

const SecurityNotice: React.FC<SecurityNoticeProps> = ({ language }) => {
  return (
    <div className="glass rounded-3xl p-8 shadow-medium dark:shadow-dark-medium animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{getTranslation('security.title', language)}</h3>
          <div className="flex items-center gap-2 text-success-600 dark:text-success-400 mt-1">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">{getTranslation('security.subtitle', language)}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        {getTranslation('security.description', language)}
      </p>
    </div>
  );
};

export default SecurityNotice;