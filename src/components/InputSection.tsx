import React, { useState } from 'react';
import { FileText, Upload, Loader2, Brain, AlertCircle, CheckCircle, Eye, RefreshCw, Camera, Type, X } from 'lucide-react';
import { getTranslation, Language } from '../utils/translations';
import OpenRouterAPI from '../utils/openRouterAPI';

interface InputSectionProps {
  onProcess: (input: string, type: 'text' | 'image') => void;
  isProcessing: boolean;
  language: Language;
}

interface OCRFailureModal {
  show: boolean;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'manual';
  showRetry: boolean;
  showManual: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onProcess, isProcessing, language }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractionError, setExtractionError] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');
  
  // OCR failure tracking
  const [ocrFailCount, setOcrFailCount] = useState(0);
  const [failureModal, setFailureModal] = useState<OCRFailureModal>({
    show: false,
    title: '',
    message: '',
    type: 'warning',
    showRetry: true,
    showManual: false
  });

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (textInput.trim() && !isProcessing) {
      onProcess(textInput, 'text');
    }
  };

  const handleManualTextSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (manualText.trim() && !isProcessing) {
      onProcess(manualText, 'text');
      setShowManualInput(false);
      setManualText('');
      // Reset OCR fail count on successful manual entry
      setOcrFailCount(0);
    }
  };

  const resetOCRState = () => {
    setSelectedFile(null);
    setIsExtracting(false);
    setExtractionProgress(0);
    setExtractedText('');
    setExtractionError('');
    setProcessingSteps([]);
    setShowPreview(false);
    setShowManualInput(false);
    setManualText('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const showOCRFailureModal = (failCount: number) => {
    let modal: OCRFailureModal;

    switch (failCount) {
      case 1:
        modal = {
          show: true,
          title: 'Image Not Clear',
          message: 'The image is not clear enough for text recognition. Please upload a clearer photo of the prescription with better lighting and focus.',
          type: 'warning',
          showRetry: true,
          showManual: false
        };
        break;
      case 2:
        modal = {
          show: true,
          title: 'Still Having Trouble',
          message: 'We still couldn\'t read the prescription clearly. Try again with a different photo or proceed to enter the medicine details manually.',
          type: 'warning',
          showRetry: true,
          showManual: true
        };
        break;
      case 3:
      default:
        modal = {
          show: true,
          title: 'Manual Entry Required',
          message: 'We couldn\'t understand your prescription after multiple attempts. Please type the medicine name(s) manually below for the best results.',
          type: 'manual',
          showRetry: false,
          showManual: true
        };
        break;
    }

    setFailureModal(modal);
  };

  const handleOCRFailure = (error: Error) => {
    const newFailCount = ocrFailCount + 1;
    setOcrFailCount(newFailCount);
    
    console.log(`OCR Failure #${newFailCount}:`, error.message);
    
    setIsExtracting(false);
    setExtractionError(error.message);
    setProcessingSteps([`❌ OCR attempt ${newFailCount} failed`]);
    
    // Show appropriate modal based on failure count
    showOCRFailureModal(newFailCount);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFailureModal(prev => ({ ...prev, show: false }));
  };

  const handleModalRetry = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleModalClose();
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleModalManual = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleModalClose();
    setShowManualInput(true);
    
    // If this is the 3rd failure, automatically show manual input
    if (ocrFailCount >= 3) {
      setActiveTab('text');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setSelectedFile(file);
      setIsExtracting(true);
      setExtractionProgress(0);
      setExtractedText('');
      setExtractionError('');
      setProcessingSteps([]);
      setShowManualInput(false);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      console.log(`🔍 Starting OCR extraction attempt #${ocrFailCount + 1} for:`, file.name);
      
      // Update processing steps based on progress
      setProcessingSteps(['🚀 Starting multi-method OCR extraction...']);
      
      // Extract text from image using the new OCR service
      const extractedText = await OpenRouterAPI.extractAndValidatePrescription(
        file, 
        (progress) => {
          setExtractionProgress(progress);
          
          // Update processing steps based on progress
          if (progress <= 20) {
            setProcessingSteps(['🚀 Starting extraction...', '🔍 Trying OCR.Space API...']);
          } else if (progress <= 50) {
            setProcessingSteps(['🚀 Starting extraction...', '🔍 OCR.Space processing...']);
          } else if (progress <= 80) {
            setProcessingSteps(['🚀 Starting extraction...', '🔍 OCR processing...', '🤖 Analyzing results...']);
          } else {
            setProcessingSteps(['🚀 Starting extraction...', '🔍 OCR processing...', '🤖 Analysis complete', '✅ Finalizing...']);
          }
        }
      );
      
      console.log('✅ OCR extraction completed successfully. Text length:', extractedText.length);
      setExtractedText(extractedText);
      setIsExtracting(false);
      setProcessingSteps(['🚀 Starting extraction...', '🔍 OCR processing...', '🤖 Analysis complete', '✅ Text extracted successfully']);
      
      // Reset fail count on successful extraction
      setOcrFailCount(0);
      
      // Automatically process the extracted text after a brief delay
      setTimeout(() => {
        onProcess(extractedText, 'image');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error extracting text from image:', error);
      handleOCRFailure(error instanceof Error ? error : new Error('Unknown OCR error'));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      // Validate file type
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        setExtractionError('Please upload an image file (JPG, PNG, GIF, BMP, WEBP) or PDF');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        setExtractionError('Please upload an image file (JPG, PNG, GIF, BMP, WEBP) or PDF');
      }
    }
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const retryExtraction = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const clearFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    resetOCRState();
    // Reset fail count when user chooses a new file
    setOcrFailCount(0);
  };

  const handleSampleTextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setTextInput(`Rx: Dr. Smith Medical Center
Patient: John Doe
Date: ${new Date().toLocaleDateString()}

1. Amoxicillin 500mg
   Sig: 1 cap PO TID x 7 days
   Take with food

2. Ibuprofen 400mg  
   Sig: 1 tab PO BID PRN pain
   Max 3 days, take with food

3. Omeprazole 20mg
   Sig: 1 cap PO daily before breakfast
   Continue for 2 weeks

Refills: 0
Dr. Sarah Smith, MD`);
  };

  // Reset fail count when switching tabs or on page refresh
  React.useEffect(() => {
    setOcrFailCount(0);
  }, [activeTab]);

  return (
    <div className="glass-strong rounded-3xl p-8 shadow-strong dark:shadow-dark-strong animate-slide-up max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-medium">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {getTranslation('input.title', language)}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Multi-method OCR with OCR.Space API and Tesseract.js fallback
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveTab('text');
          }}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'text'
              ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-soft dark:shadow-dark-soft'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          <FileText className="w-5 h-5 inline mr-2" />
          {getTranslation('input.text', language)}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setActiveTab('image');
          }}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'image'
              ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-soft dark:shadow-dark-soft'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          <Camera className="w-5 h-5 inline mr-2" />
          {getTranslation('input.image', language)}
        </button>
      </div>

      {/* Input Content */}
      {activeTab === 'text' ? (
        <form onSubmit={handleTextSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your prescription text here... (e.g., Amoxicillin 500mg TID, Ibuprofen 400mg BID PRN)"
              className="w-full h-40 p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all duration-300 resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
              {textInput.length}/2000
            </div>
          </div>
          
          {/* Sample Text Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSampleTextClick}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300 font-medium"
            >
              📋 Try Sample Prescription
            </button>
          </div>

          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            className="w-full py-4 px-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <Brain className="w-5 h-5" />
                {getTranslation('input.decoding', language)}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Brain className="w-5 h-5" />
                🤖 AI {getTranslation('input.decode', language)}
              </div>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isExtracting ? (
              <div className="space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {extractionProgress}%
                    </span>
                  </div>
                </div>
                <p className="text-primary-600 dark:text-primary-400 text-lg font-medium">
                  🔍 Multi-Method OCR Processing...
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Trying multiple OCR methods for best results
                  {ocrFailCount > 0 && ` (Attempt ${ocrFailCount + 1})`}
                </p>
                
                {/* Processing Steps */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <div className="space-y-2">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 max-w-xs mx-auto">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : extractedText ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <p className="text-green-600 dark:text-green-400 text-lg font-medium">
                  ✅ Text extracted successfully!
                </p>
                
                {/* Show processing steps */}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
                  <div className="space-y-1">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 max-h-40 overflow-y-auto border border-green-200 dark:border-green-700">
                  <p className="text-sm text-green-800 dark:text-green-300 text-left whitespace-pre-wrap">
                    {extractedText.substring(0, 400)}
                    {extractedText.length > 400 && '...'}
                  </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPreview(!showPreview);
                    }}
                    className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Hide' : 'Show'} Image
                  </button>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="py-2 px-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium"
                  >
                    Choose Different Image
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  🤖 Processing with AI...
                </p>
              </div>
            ) : extractionError ? (
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                  ❌ OCR Attempt {ocrFailCount} Failed
                </p>
                <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-200 dark:border-red-700">
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                    {extractionError}
                  </p>
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {ocrFailCount >= 3 
                      ? 'Multiple attempts failed. Please type manually for best results.'
                      : 'Please try a clearer image or type manually.'
                    }
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowManualInput(true);
                    }}
                    className="py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    <Type className="w-4 h-4" />
                    Type Manually
                  </button>
                  {ocrFailCount < 3 && (
                    <button
                      type="button"
                      onClick={retryExtraction}
                      className="py-2 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry OCR ({3 - ocrFailCount} left)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    className="py-2 px-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-medium"
                  >
                    New Image
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Drop your prescription image here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  📸 Supports JPG, PNG, GIF, BMP, WEBP, PDF • Multi-method OCR processing
                  {ocrFailCount > 0 && (
                    <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">
                      Previous attempts: {ocrFailCount} • {3 - ocrFailCount} attempts remaining
                    </span>
                  )}
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing || isExtracting}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block py-3 px-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold shadow-medium dark:shadow-dark-medium hover:shadow-strong dark:hover:shadow-dark-strong transform hover:scale-105"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Choose Image for Multi-Method OCR
                </label>
                {selectedFile && !extractionError && !extractedText && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-4 inline-block">
                    📁 Selected: {selectedFile.name}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Manual Input Modal */}
          {showManualInput && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  Type Your Prescription Manually
                </h4>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                {ocrFailCount >= 3 
                  ? 'After multiple OCR attempts, manual entry will provide the most accurate results:'
                  : 'Since we couldn\'t read the image clearly, please type the medicine names, dosages, and instructions below:'
                }
              </p>
              <form onSubmit={handleManualTextSubmit} className="space-y-4">
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Example: Amoxicillin 500mg, take 1 capsule 3 times daily with food for 7 days"
                  className="w-full h-32 p-4 border-2 border-blue-200 dark:border-blue-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowManualInput(false);
                    }}
                    className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!manualText.trim()}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                  >
                    <Brain className="w-5 h-5 inline mr-2" />
                    Analyze Text
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Image Preview */}
          {showPreview && previewUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Image Preview:</h4>
              <img 
                src={previewUrl} 
                alt="Prescription preview" 
                className="max-w-full h-auto rounded-xl border border-gray-300 dark:border-gray-600"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Enhanced OCR Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📸 Multi-Method OCR Features:</h4>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
              <li>• Primary: OCR.Space API for high accuracy</li>
              <li>• Fallback: Tesseract.js for offline processing</li>
              <li>• Automatic retry with different methods</li>
              <li>• Handles both printed and handwritten text</li>
              <li>• Manual entry option after 3 failed attempts</li>
              <li>• Works with JPG, PNG, GIF, BMP, WEBP, PDF files</li>
            </ul>
          </div>
        </div>
      )}

      {/* AI Processing Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-purple-800 dark:text-purple-300 font-medium text-sm">
              🤖 Powered by Advanced AI & Multi-Method OCR
            </p>
            <p className="text-purple-600 dark:text-purple-400 text-xs">
              Your prescription will be analyzed by DeepSeek AI with multiple OCR methods for maximum accuracy
            </p>
          </div>
        </div>
      </div>

      {/* OCR Failure Modal */}
      {failureModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  failureModal.type === 'manual' 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                    : 'bg-gradient-to-br from-orange-500 to-red-600'
                }`}>
                  {failureModal.type === 'manual' ? (
                    <Type className="w-5 h-5 text-white" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {failureModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleModalClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {failureModal.message}
            </p>
            
            <div className="flex gap-3">
              {failureModal.showRetry && (
                <button
                  type="button"
                  onClick={handleModalRetry}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Try Again
                </button>
              )}
              {failureModal.showManual && (
                <button
                  type="button"
                  onClick={handleModalManual}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
                >
                  <Type className="w-4 h-4 inline mr-2" />
                  Type Manually
                </button>
              )}
              {!failureModal.showRetry && !failureModal.showManual && (
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSection;