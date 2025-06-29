import React from 'react';
import { getTranslation, Language } from '../utils/translations';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
          {/* Left Side - Branding */}
          <div className="space-y-2">
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
              © 2025 Doctor Decoder
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium max-w-sm">
              Empowering people to understand their prescriptions
            </p>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Security Notice */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              🔒 100% secure – your data is not stored
            </p>

            {/* Built with Bolt Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-soft dark:shadow-dark-soft hover:shadow-medium dark:hover:shadow-dark-medium transition-all duration-300 transform hover:scale-105 border border-gray-300 dark:border-gray-600">
              <span className="text-base">🔧</span>
              Built with Bolt.new
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;