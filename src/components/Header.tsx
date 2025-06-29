import React from 'react';
import { Stethoscope } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';

interface HeaderProps {
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  const subtitle = getTranslation('app.subtitle', language);
  const subtitleParts = subtitle?.split('.') || [];
  const firstPart = subtitleParts[0]?.trim() || '';
  const secondPart = subtitleParts[1]?.trim() || '';

  return (
    <header className="text-center py-12 animate-fade-in">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-medium">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {getTranslation('app.title', language)}
        </h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
        {firstPart && `${firstPart}.`}
        {secondPart && (
          <>
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              {secondPart}.
            </span>
          </>
        )}
      </p>
    </header>
  );
};

export default Header;