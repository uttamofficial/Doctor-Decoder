export class ImagePreprocessor {
  private static createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private static getImageData(image: HTMLImageElement): ImageData {
    const canvas = this.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
  }

  private static putImageData(imageData: ImageData): HTMLCanvasElement {
    const canvas = this.createCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  // Convert image to grayscale for better OCR
  private static toGrayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = gray;     // Red
      data[i + 1] = gray; // Green
      data[i + 2] = gray; // Blue
      // Alpha channel (data[i + 3]) remains unchanged
    }
    return imageData;
  }

  // Enhance contrast for better text recognition
  private static enhanceContrast(imageData: ImageData, factor: number = 1.5): ImageData {
    const data = imageData.data;
    const contrast = (factor - 1) * 128;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * data[i] + contrast));
      data[i + 1] = Math.max(0, Math.min(255, factor * data[i + 1] + contrast));
      data[i + 2] = Math.max(0, Math.min(255, factor * data[i + 2] + contrast));
    }
    return imageData;
  }

  // Apply adaptive threshold for better text recognition
  private static applyAdaptiveThreshold(imageData: ImageData): ImageData {
    const { width, height, data } = imageData;
    const newData = new Uint8ClampedArray(data);
    const windowSize = 15; // Size of the local window
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Calculate local mean
        let sum = 0;
        let count = 0;
        
        for (let dy = -windowSize; dy <= windowSize; dy++) {
          for (let dx = -windowSize; dx <= windowSize; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const neighborIdx = (ny * width + nx) * 4;
              sum += data[neighborIdx];
              count++;
            }
          }
        }
        
        const localMean = sum / count;
        const threshold = localMean * 0.9; // Slightly below local mean
        const gray = data[idx];
        const binary = gray > threshold ? 255 : 0;
        
        newData[idx] = binary;
        newData[idx + 1] = binary;
        newData[idx + 2] = binary;
      }
    }
    
    return new ImageData(newData, width, height);
  }

  // Advanced noise reduction
  private static advancedNoiseReduction(imageData: ImageData): ImageData {
    const { width, height, data } = imageData;
    const newData = new Uint8ClampedArray(data);
    
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = (y * width + x) * 4;
        
        // Get 5x5 neighborhood
        const pixels = [];
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
            pixels.push(data[neighborIdx]);
          }
        }
        
        // Apply weighted median filter
        pixels.sort((a, b) => a - b);
        const median = pixels[Math.floor(pixels.length / 2)];
        
        // Only apply if the change is significant (preserve edges)
        const original = data[idx];
        const diff = Math.abs(original - median);
        
        if (diff < 40) { // Threshold for noise vs edge
          newData[idx] = median;
          newData[idx + 1] = median;
          newData[idx + 2] = median;
        } else {
          newData[idx] = original;
          newData[idx + 1] = original;
          newData[idx + 2] = original;
        }
      }
    }
    
    return new ImageData(newData, width, height);
  }

  // Scale image for optimal OCR (300-600 DPI equivalent)
  private static scaleForOCR(image: HTMLImageElement): HTMLCanvasElement {
    const aspectRatio = image.height / image.width;
    
    // Calculate optimal size based on original dimensions
    let targetWidth = image.width;
    let targetHeight = image.height;
    
    // If image is too small, scale up
    if (image.width < 800) {
      targetWidth = 1200;
      targetHeight = targetWidth * aspectRatio;
    }
    // If image is too large, scale down
    else if (image.width > 2400) {
      targetWidth = 1800;
      targetHeight = targetWidth * aspectRatio;
    }
    
    const canvas = this.createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d')!;
    
    // Use high-quality scaling with specific settings for text
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Apply slight sharpening during scaling
    ctx.filter = 'contrast(1.2) brightness(1.1)';
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    
    return canvas;
  }

  // Main preprocessing pipeline optimized for medical prescriptions
  static async preprocessImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          console.log('🔍 Starting advanced image preprocessing...');
          console.log('Original image:', img.width, 'x', img.height, 'pixels');
          
          // Step 1: Scale image to optimal size for OCR
          const scaledCanvas = this.scaleForOCR(img);
          const scaledCtx = scaledCanvas.getContext('2d')!;
          let imageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
          
          console.log('📏 Scaled to:', scaledCanvas.width, 'x', scaledCanvas.height);
          
          // Step 2: Convert to grayscale
          imageData = this.toGrayscale(imageData);
          console.log('🎨 Converted to grayscale');
          
          // Step 3: Advanced noise reduction
          imageData = this.advancedNoiseReduction(imageData);
          console.log('🧹 Applied noise reduction');
          
          // Step 4: Enhance contrast for better text visibility
          imageData = this.enhanceContrast(imageData, 1.5);
          console.log('🔆 Enhanced contrast');
          
          // Step 5: Apply adaptive threshold (better for text)
          imageData = this.applyAdaptiveThreshold(imageData);
          console.log('⚫ Applied adaptive threshold');
          
          // Step 6: Create final optimized image
          const finalCanvas = this.putImageData(imageData);
          
          // Convert to high-quality PNG
          finalCanvas.toBlob((blob) => {
            if (blob) {
              console.log('✅ Preprocessing complete. Output size:', blob.size, 'bytes');
              resolve(blob);
            } else {
              reject(new Error('Failed to create preprocessed image'));
            }
          }, 'image/png', 1.0); // Maximum quality for OCR
          
        } catch (error) {
          console.error('❌ Image preprocessing error:', error);
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for preprocessing'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Validate if image is suitable for OCR
  static async validateImageQuality(file: File): Promise<{ isValid: boolean; issues: string[]; suggestions: string[] }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const issues: string[] = [];
        const suggestions: string[] = [];
        
        // Check resolution
        if (img.width < 400 || img.height < 300) {
          issues.push('Image resolution is too low');
          suggestions.push('Use a higher resolution image (at least 800x600)');
        }
        
        // Check aspect ratio (very wide or tall images might be problematic)
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 4 || aspectRatio < 0.25) {
          issues.push('Unusual aspect ratio detected');
          suggestions.push('Ensure the prescription fills most of the image frame');
        }
        
        // Check file size (too small might indicate low quality)
        if (file.size < 50000) { // 50KB
          issues.push('File size is very small, might indicate low quality');
          suggestions.push('Use a higher quality camera setting');
        }
        
        // Check if image is too large (might cause processing issues)
        if (file.size > 10000000) { // 10MB
          issues.push('File size is very large');
          suggestions.push('Compress the image or use a smaller file size');
        }
        
        const isValid = issues.length === 0;
        resolve({ isValid, issues, suggestions });
      };
      
      img.onerror = () => {
        resolve({
          isValid: false,
          issues: ['Cannot read image file'],
          suggestions: ['Try a different image format (JPG, PNG)']
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}