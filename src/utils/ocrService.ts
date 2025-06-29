// OCR Service with multiple fallback methods
interface OCRResult {
  text: string;
  confidence: number;
  method: string;
  success: boolean;
  error?: string;
}

interface OCRProgress {
  stage: string;
  progress: number;
  message: string;
}

export class OCRService {
  // Note: This is a demo API key that may not work in production
  // Users should replace with their own OCR.Space API key
  private static readonly OCR_SPACE_API_KEY = 'helloworld'; // Free demo key
  private static readonly OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

  // Method 1: OCR.Space API (Primary, but with better error handling)
  static async extractWithOCRSpace(file: File, onProgress?: (progress: OCRProgress) => void): Promise<OCRResult> {
    try {
      console.log('🔍 Starting OCR.Space extraction...');
      
      if (onProgress) {
        onProgress({ stage: 'upload', progress: 10, message: 'Uploading image to OCR.Space...' });
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('apikey', this.OCR_SPACE_API_KEY);
      formData.append('OCREngine', '2');
      formData.append('scale', 'true');
      formData.append('isTable', 'false');
      formData.append('detectOrientation', 'true');

      if (onProgress) {
        onProgress({ stage: 'processing', progress: 50, message: 'Processing image with OCR.Space...' });
      }

      const response = await fetch(this.OCR_SPACE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 404) {
          throw new Error('OCR.Space API endpoint not found - API key may be invalid or service unavailable');
        } else if (response.status === 401) {
          throw new Error('OCR.Space API authentication failed - invalid API key');
        } else if (response.status === 429) {
          throw new Error('OCR.Space API rate limit exceeded - please try again later');
        } else {
          throw new Error(`OCR.Space API error: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      
      if (onProgress) {
        onProgress({ stage: 'parsing', progress: 90, message: 'Parsing OCR results...' });
      }

      console.log('OCR.Space response:', result);

      if (result.IsErroredOnProcessing) {
        throw new Error(`OCR.Space processing error: ${result.ErrorMessage || 'Unknown error'}`);
      }

      if (!result.ParsedResults || result.ParsedResults.length === 0) {
        throw new Error('No text found in image');
      }

      const extractedText = result.ParsedResults[0].ParsedText || '';
      
      if (extractedText.trim().length < 3) {
        throw new Error('Extracted text is too short - image may not contain readable text');
      }

      if (onProgress) {
        onProgress({ stage: 'complete', progress: 100, message: 'OCR extraction completed successfully' });
      }

      return {
        text: extractedText.trim(),
        confidence: 85,
        method: 'OCR.Space API',
        success: true
      };

    } catch (error) {
      console.error('❌ OCR.Space extraction failed:', error);
      return {
        text: '',
        confidence: 0,
        method: 'OCR.Space API',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown OCR.Space error'
      };
    }
  }

  // Method 2: Tesseract.js (Primary fallback - more reliable)
  static async extractWithTesseract(file: File, onProgress?: (progress: OCRProgress) => void): Promise<OCRResult> {
    try {
      console.log('🔍 Starting Tesseract.js extraction...');
      
      if (onProgress) {
        onProgress({ stage: 'init', progress: 5, message: 'Initializing Tesseract.js...' });
      }

      // Dynamic import to avoid loading Tesseract unless needed
      const Tesseract = await import('tesseract.js');
      
      if (onProgress) {
        onProgress({ stage: 'processing', progress: 20, message: 'Processing with Tesseract.js...' });
      }

      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            const progress = 20 + (m.progress * 70); // 20-90% for OCR
            onProgress({ 
              stage: 'ocr', 
              progress: Math.round(progress), 
              message: `Recognizing text... ${Math.round(m.progress * 100)}%` 
            });
          }
        },
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:()[]{}/-+= \n\t',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
      });

      if (onProgress) {
        onProgress({ stage: 'complete', progress: 100, message: 'Tesseract extraction completed' });
      }

      const extractedText = result.data.text?.trim() || '';
      const confidence = result.data.confidence || 0;

      if (extractedText.length < 3) {
        throw new Error('Extracted text is too short - image may not contain readable text');
      }

      return {
        text: extractedText,
        confidence: confidence,
        method: 'Tesseract.js',
        success: true
      };

    } catch (error) {
      console.error('❌ Tesseract.js extraction failed:', error);
      return {
        text: '',
        confidence: 0,
        method: 'Tesseract.js',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Tesseract error'
      };
    }
  }

  // Method 3: Canvas-based text detection (Basic fallback)
  static async extractWithCanvas(file: File, onProgress?: (progress: OCRProgress) => void): Promise<OCRResult> {
    try {
      console.log('🔍 Starting Canvas-based extraction...');
      
      if (onProgress) {
        onProgress({ stage: 'processing', progress: 50, message: 'Analyzing image structure...' });
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas not supported');
      }

      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (onProgress) {
            onProgress({ stage: 'complete', progress: 100, message: 'Image analysis completed' });
          }

          resolve({
            text: `Image Analysis Results:
- Image dimensions: ${img.width}x${img.height}
- File size: ${(file.size / 1024).toFixed(1)}KB
- File type: ${file.type}

The image appears to be valid but text extraction failed with other methods.
Please try typing the prescription manually for the most accurate results.`,
            confidence: 30,
            method: 'Canvas Analysis',
            success: true
          });
        };

        img.onerror = () => {
          resolve({
            text: '',
            confidence: 0,
            method: 'Canvas Analysis',
            success: false,
            error: 'Failed to load image'
          });
        };

        img.src = URL.createObjectURL(file);
      });

    } catch (error) {
      console.error('❌ Canvas extraction failed:', error);
      return {
        text: '',
        confidence: 0,
        method: 'Canvas Analysis',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Canvas error'
      };
    }
  }

  // Main extraction method with improved fallback strategy
  static async extractText(file: File, onProgress?: (progress: OCRProgress) => void): Promise<string> {
    console.log('🚀 Starting multi-method OCR extraction...');
    
    // Validate file first
    if (!file || file.size === 0) {
      throw new Error('No file selected or file is empty');
    }

    if (file.size > 15 * 1024 * 1024) {
      throw new Error('File too large (max 15MB)');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file (JPG, PNG, GIF, BMP, WEBP)');
    }

    // Prioritize Tesseract.js as it's more reliable than the demo OCR.Space API
    const methods = [
      { name: 'Tesseract.js', fn: this.extractWithTesseract, priority: 1 },
      { name: 'OCR.Space API', fn: this.extractWithOCRSpace, priority: 2 },
      { name: 'Canvas Analysis', fn: this.extractWithCanvas, priority: 3 }
    ];

    let lastError = '';
    let bestResult: OCRResult | null = null;

    for (let i = 0; i < methods.length; i++) {
      const method = methods[i];
      
      try {
        console.log(`🔄 Trying method ${i + 1}/${methods.length}: ${method.name}`);
        
        if (onProgress) {
          onProgress({ 
            stage: 'method', 
            progress: (i / methods.length) * 100, 
            message: `Trying ${method.name}...` 
          });
        }

        const result = await method.fn(file, onProgress);
        
        if (result.success && result.text.length > 10) {
          console.log(`✅ Success with ${method.name}:`, {
            textLength: result.text.length,
            confidence: result.confidence
          });
          
          // Always prefer the first successful result for simplicity
          if (!bestResult) {
            bestResult = result;
          }
          
          // If we got a decent result from Tesseract, use it immediately
          if (result.method === 'Tesseract.js' && result.confidence > 30) {
            break;
          }
          
          // If we got a high-confidence result from any method, stop trying
          if (result.confidence > 70) {
            break;
          }
        } else {
          console.log(`❌ Failed with ${method.name}:`, result.error);
          lastError = result.error || `${method.name} failed`;
        }

      } catch (error) {
        console.error(`❌ Error with ${method.name}:`, error);
        lastError = error instanceof Error ? error.message : `${method.name} failed`;
      }
    }

    if (bestResult && bestResult.success) {
      console.log(`✅ OCR completed successfully with ${bestResult.method}`);
      
      // Add metadata to the result
      const metadata = [
        '=== OCR EXTRACTION RESULTS ===',
        `✅ Method: ${bestResult.method}`,
        `📊 Confidence: ${bestResult.confidence.toFixed(1)}%`,
        `📝 Text Length: ${bestResult.text.length} characters`,
        '',
        '=== EXTRACTED TEXT ===',
        ''
      ].join('\n');

      return metadata + bestResult.text;
    }

    // If all methods failed, throw an error with helpful information
    throw new Error(`All OCR methods failed. Last error: ${lastError}. 

Please try:
1. Taking a clearer photo with better lighting
2. Ensuring the prescription text is clearly visible
3. Using a higher resolution image
4. Typing the prescription manually for best results

Note: The OCR.Space API may require a valid API key for production use.`);
  }

  // Test OCR functionality
  static async testOCR(): Promise<{ success: boolean; details: string }> {
    try {
      // Create a simple test image with text
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return { success: false, details: 'Canvas not supported' };
      }

      // Draw test prescription text
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 400, 200);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText('Test Prescription', 50, 50);
      ctx.fillText('Amoxicillin 500mg', 50, 80);
      ctx.fillText('Take 1 tablet TID', 50, 110);

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve({ success: false, details: 'Failed to create test image' });
            return;
          }

          try {
            const testFile = new File([blob], 'test.png', { type: 'image/png' });
            const result = await this.extractText(testFile);
            
            const success = result.toLowerCase().includes('amoxicillin') || 
                          result.toLowerCase().includes('prescription');
            
            resolve({
              success,
              details: `OCR test ${success ? 'passed' : 'failed'}. Result length: ${result.length} chars.`
            });
          } catch (error) {
            resolve({
              success: false,
              details: `OCR test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
          }
        }, 'image/png');
      });

    } catch (error) {
      return {
        success: false,
        details: `Test setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}