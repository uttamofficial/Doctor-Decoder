import React from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';

interface LoadingStateProps {
  language: Language;
}

const LoadingState: React.FC<LoadingStateProps> = ({ language }) => {
  return (
    <div className="glass-strong rounded-3xl p-12 shadow-strong dark:shadow-dark-strong animate-scale-in max-w-2xl mx-auto text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin absolute -top-1 -right-1" />
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {getTranslation('loading.title', language)}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
        {getTranslation('loading.subtitle', language)}
      </p>
      
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;