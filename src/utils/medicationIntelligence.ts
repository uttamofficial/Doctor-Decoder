interface PersonalDetails {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
}

interface MedicalHistoryData {
  conditions: string[];
  allergies: string[];
  currentMedications: string[];
  additionalNotes: string;
}

interface IntelligentRecommendation {
  type: 'dosage' | 'timing' | 'duration' | 'warning' | 'monitoring';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

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

export class MedicationIntelligence {
  static getWeightInKg(weight: number, unit: 'kg' | 'lbs'): number {
    return unit === 'kg' ? weight : weight * 0.453592;
  }

  static getHeightInCm(height: number, unit: 'cm' | 'ft'): number {
    return unit === 'cm' ? height : height * 30.48;
  }

  static calculateBMI(weight: number, height: number, weightUnit: 'kg' | 'lbs' = 'kg', heightUnit: 'cm' | 'ft' = 'cm'): number {
    const weightKg = this.getWeightInKg(weight, weightUnit);
    const heightCm = this.getHeightInCm(height, heightUnit);
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  static getAgeCategory(age: number): string {
    if (age < 2) return 'infant';
    if (age < 12) return 'child';
    if (age < 18) return 'adolescent';
    if (age < 65) return 'adult';
    return 'senior';
  }

  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  static generatePersonalizedRecommendations(
    medicationName: string,
    personalDetails: PersonalDetails,
    medicalHistory: MedicalHistoryData
  ): IntelligentRecommendation[] {
    const recommendations: IntelligentRecommendation[] = [];
    const weightKg = this.getWeightInKg(personalDetails.weight, personalDetails.weightUnit);
    const heightCm = this.getHeightInCm(personalDetails.height, personalDetails.heightUnit);
    const bmi = this.calculateBMI(personalDetails.weight, personalDetails.height, personalDetails.weightUnit, personalDetails.heightUnit);
    const ageCategory = this.getAgeCategory(personalDetails.age);
    const bmiCategory = this.getBMICategory(bmi);

    // Age-based recommendations
    if (ageCategory === 'senior') {
      recommendations.push({
        type: 'timing',
        message: `${personalDetails.name}, as a senior, consider taking medications earlier in the day to avoid sleep disruption. Your body may process medications more slowly.`,
        severity: 'info'
      });

      recommendations.push({
        type: 'monitoring',
        message: `${personalDetails.name}, seniors should monitor for increased side effects and drug interactions. Consider more frequent check-ups.`,
        severity: 'warning'
      });
    }

    if (ageCategory === 'child' || ageCategory === 'adolescent') {
      recommendations.push({
        type: 'dosage',
        message: `For ${personalDetails.name}, pediatric dosing is weight-based and requires careful calculation. Always verify dosage with your pediatrician.`,
        severity: 'critical'
      });

      recommendations.push({
        type: 'timing',
        message: `For ${personalDetails.name}, consider liquid formulations if available and ensure medications are taken with adult supervision.`,
        severity: 'warning'
      });
    }

    // BMI-based recommendations
    if (bmiCategory === 'underweight') {
      recommendations.push({
        type: 'dosage',
        message: `${personalDetails.name}, your BMI indicates underweight status (${bmi.toFixed(1)}). This may require dosage adjustments. Discuss with your doctor if you experience stronger effects than expected.`,
        severity: 'warning'
      });
    }

    if (bmiCategory === 'obese') {
      recommendations.push({
        type: 'dosage',
        message: `${personalDetails.name}, your BMI indicates obesity (${bmi.toFixed(1)}). Higher body weight may affect medication effectiveness and distribution. Your doctor may need to adjust dosages.`,
        severity: 'info'
      });

      recommendations.push({
        type: 'monitoring',
        message: `${personalDetails.name}, obesity can affect how medications are processed. Monitor for effectiveness and discuss any concerns with your healthcare provider.`,
        severity: 'info'
      });
    }

    // Weight-based recommendations
    if (weightKg < 50) {
      recommendations.push({
        type: 'dosage',
        message: `${personalDetails.name}, your lower body weight (${weightKg.toFixed(1)}kg) may require dosage adjustments. Discuss with your doctor if you experience stronger effects than expected.`,
        severity: 'warning'
      });
    }

    if (weightKg > 100) {
      recommendations.push({
        type: 'dosage',
        message: `${personalDetails.name}, higher body weight (${weightKg.toFixed(1)}kg) may affect medication effectiveness. Your doctor may need to adjust dosages for optimal results.`,
        severity: 'info'
      });
    }

    // Gender-specific recommendations
    if (personalDetails.gender === 'female') {
      recommendations.push({
        type: 'warning',
        message: `${personalDetails.name}, if you are pregnant, planning to become pregnant, or breastfeeding, inform your healthcare provider immediately.`,
        severity: 'critical'
      });
    }

    // Medication-specific intelligence
    if (medicationName.toLowerCase().includes('ibuprofen') || medicationName.toLowerCase().includes('nsaid')) {
      if (personalDetails.age >= 65) {
        recommendations.push({
          type: 'warning',
          message: `${personalDetails.name}, NSAIDs like ibuprofen carry increased risks for seniors, including stomach bleeding and kidney problems. Use the lowest effective dose.`,
          severity: 'warning'
        });
      }

      if (weightKg < 50) {
        recommendations.push({
          type: 'dosage',
          message: `${personalDetails.name}, consider starting with a lower dose of ibuprofen due to your body weight. 200mg may be sufficient instead of 400mg.`,
          severity: 'info'
        });
      }

      if (bmiCategory === 'obese') {
        recommendations.push({
          type: 'monitoring',
          message: `${personalDetails.name}, obesity may increase the risk of cardiovascular side effects with NSAIDs. Monitor blood pressure and discuss with your doctor.`,
          severity: 'warning'
        });
      }
    }

    if (medicationName.toLowerCase().includes('amoxicillin') || medicationName.toLowerCase().includes('antibiotic')) {
      if (ageCategory === 'senior') {
        recommendations.push({
          type: 'duration',
          message: `${personalDetails.name}, complete the full antibiotic course even if you feel better. Seniors are at higher risk for antibiotic-resistant infections.`,
          severity: 'warning'
        });
      }

      if (personalDetails.gender === 'female') {
        recommendations.push({
          type: 'monitoring',
          message: `${personalDetails.name}, antibiotics may increase risk of yeast infections in women. Consider probiotics and monitor for symptoms.`,
          severity: 'info'
        });
      }

      if (bmiCategory === 'obese') {
        recommendations.push({
          type: 'dosage',
          message: `${personalDetails.name}, obesity may affect antibiotic distribution. Ensure your doctor knows your current weight for proper dosing.`,
          severity: 'info'
        });
      }
    }

    // Medical history interactions
    if (medicalHistory.conditions.includes('Diabetes') || medicalHistory.conditions.includes('diabetes')) {
      recommendations.push({
        type: 'monitoring',
        message: `${personalDetails.name}, monitor blood sugar levels more frequently while taking new medications, as they may affect glucose control.`,
        severity: 'warning'
      });
    }

    if (medicalHistory.conditions.includes('Kidney Disease') || medicalHistory.conditions.includes('kidney')) {
      recommendations.push({
        type: 'dosage',
        message: `${personalDetails.name}, kidney disease may require dosage adjustments for many medications. Ensure your doctor knows about your kidney function.`,
        severity: 'critical'
      });
    }

    return recommendations;
  }

  static generateTimingRecommendations(
    personalDetails: PersonalDetails,
    medicationSchedule: string
  ): string[] {
    const recommendations: string[] = [];
    const ageCategory = this.getAgeCategory(personalDetails.age);
    const bmi = this.calculateBMI(personalDetails.weight, personalDetails.height, personalDetails.weightUnit, personalDetails.heightUnit);
    const bmiCategory = this.getBMICategory(bmi);

    if (ageCategory === 'senior') {
      if (medicationSchedule.includes('t.i.d') || medicationSchedule.includes('three times')) {
        recommendations.push(`For ${personalDetails.name}: Take at 8 AM, 2 PM, and 8 PM to avoid late-night dosing`);
      }
      if (medicationSchedule.includes('b.i.d') || medicationSchedule.includes('twice')) {
        recommendations.push(`For ${personalDetails.name}: Take at 8 AM and 6 PM to ensure adequate spacing without affecting sleep`);
      }
    }

    if (ageCategory === 'child' || ageCategory === 'adolescent') {
      recommendations.push(`For ${personalDetails.name}: Coordinate medication times with meals and school schedule`);
      recommendations.push('Set reminders and ensure adult supervision for all doses');
    }

    if (personalDetails.gender === 'female' && personalDetails.age >= 12 && personalDetails.age <= 50) {
      recommendations.push(`${personalDetails.name}, track medication timing with menstrual cycle as hormonal changes may affect drug effectiveness`);
    }

    if (bmiCategory === 'obese') {
      recommendations.push(`${personalDetails.name}, with higher BMI (${bmi.toFixed(1)}), maintain consistent timing to ensure steady medication levels`);
    }

    return recommendations;
  }

  static calculatePersonalizedDosage(
    standardDosage: string,
    personalDetails: PersonalDetails
  ): string {
    const weightKg = this.getWeightInKg(personalDetails.weight, personalDetails.weightUnit);
    const bmi = this.calculateBMI(personalDetails.weight, personalDetails.height, personalDetails.weightUnit, personalDetails.heightUnit);
    const ageCategory = this.getAgeCategory(personalDetails.age);
    const bmiCategory = this.getBMICategory(bmi);
    
    let adjustmentNote = '';

    if (ageCategory === 'senior') {
      adjustmentNote = ` (${personalDetails.name}, seniors may need reduced doses - consult your doctor)`;
    } else if (ageCategory === 'child' || ageCategory === 'adolescent') {
      adjustmentNote = ` (${personalDetails.name}, pediatric dosing: typically 10-15mg/kg - verify with pediatrician)`;
    } else if (weightKg < 50) {
      adjustmentNote = ` (${personalDetails.name}, lower body weight may require dose reduction)`;
    } else if (bmiCategory === 'obese') {
      adjustmentNote = ` (${personalDetails.name}, BMI ${bmi.toFixed(1)} may require dose adjustment for optimal effectiveness)`;
    } else if (weightKg > 100) {
      adjustmentNote = ` (${personalDetails.name}, higher body weight may require dose adjustment)`;
    }

    return standardDosage + adjustmentNote;
  }

  static generateFollowUpTips(
    medications: MedicationInfo[],
    personalDetails: PersonalDetails | null,
    medicalHistory: MedicalHistoryData | null
  ): FollowUpTip[] {
    const tips: FollowUpTip[] = [];
    
    if (!personalDetails || !medicalHistory) return tips;

    const ageCategory = this.getAgeCategory(personalDetails.age);
    const weightKg = this.getWeightInKg(personalDetails.weight, personalDetails.weightUnit);
    const bmi = this.calculateBMI(personalDetails.weight, personalDetails.height, personalDetails.weightUnit, personalDetails.heightUnit);
    const bmiCategory = this.getBMICategory(bmi);

    // BMI-specific tips
    if (bmiCategory === 'obese') {
      tips.push({
        type: 'question',
        title: 'Ask Your Doctor',
        message: `${personalDetails.name}, ask your doctor: "Should my medication dosages be adjusted based on my BMI of ${bmi.toFixed(1)}?"`,
        priority: 'high',
        icon: '⚖️'
      });

      tips.push({
        type: 'lifestyle',
        title: 'Weight Management',
        message: `${personalDetails.name}, maintaining a healthy weight can improve medication effectiveness and reduce side effects. Discuss weight management strategies with your healthcare provider.`,
        priority: 'medium',
        icon: '🏃‍♂️'
      });
    }

    if (bmiCategory === 'underweight') {
      tips.push({
        type: 'warning',
        title: 'Underweight Alert',
        message: `${personalDetails.name}, your BMI of ${bmi.toFixed(1)} indicates underweight status. This may affect how medications work. Monitor for stronger effects and discuss with your doctor.`,
        priority: 'high',
        icon: '⚠️'
      });
    }

    // Medication-specific follow-up tips
    medications.forEach(med => {
      const medName = med.name.toLowerCase();

      // Antibiotic tips
      if (medName.includes('amoxicillin') || medName.includes('antibiotic')) {
        tips.push({
          type: 'question',
          title: 'Ask Your Doctor',
          message: `${personalDetails.name}, ask your doctor: "Should I take probiotics while on this antibiotic to protect my gut health?"`,
          priority: 'medium',
          icon: '❓'
        });

        tips.push({
          type: 'tip',
          title: 'Complete the Course',
          message: `${personalDetails.name}, even if you feel 100% better, finish all antibiotic pills to prevent antibiotic resistance.`,
          priority: 'high',
          icon: '💊'
        });

        if (personalDetails.gender === 'female') {
          tips.push({
            type: 'warning',
            title: 'Watch for Yeast Infections',
            message: `${personalDetails.name}, antibiotics can disrupt natural bacteria. Watch for unusual discharge or itching and contact your doctor if symptoms occur.`,
            priority: 'medium',
            icon: '⚠️'
          });
        }
      }

      // NSAID tips
      if (medName.includes('ibuprofen') || medName.includes('nsaid')) {
        tips.push({
          type: 'question',
          title: 'Ask Your Doctor',
          message: `${personalDetails.name}, ask your doctor: "Should I take this medication with food to protect my stomach?"`,
          priority: 'high',
          icon: '❓'
        });

        tips.push({
          type: 'warning',
          title: 'Stomach Protection',
          message: `${personalDetails.name}, this medicine may cause stomach upset. Take with food and stop if you experience stomach pain or black stools.`,
          priority: 'high',
          icon: '🛡️'
        });

        if (ageCategory === 'senior') {
          tips.push({
            type: 'tip',
            title: 'Senior Safety',
            message: `${personalDetails.name}, as a senior, use the lowest effective dose and for the shortest time possible to reduce risks.`,
            priority: 'high',
            icon: '👴'
          });
        }

        if (bmiCategory === 'obese') {
          tips.push({
            type: 'warning',
            title: 'Cardiovascular Risk',
            message: `${personalDetails.name}, with higher BMI, NSAIDs may increase cardiovascular risks. Monitor blood pressure and discuss with your doctor.`,
            priority: 'medium',
            icon: '❤️'
          });
        }
      }

      // Acid reducer tips
      if (medName.includes('omeprazole') || medName.includes('proton pump')) {
        tips.push({
          type: 'lifestyle',
          title: 'Timing Matters',
          message: `${personalDetails.name}, take this medication 30-60 minutes before your first meal of the day for best results.`,
          priority: 'medium',
          icon: '⏰'
        });

        tips.push({
          type: 'question',
          title: 'Ask Your Doctor',
          message: `${personalDetails.name}, ask your doctor: "How long should I take this acid reducer, and when should we review if I still need it?"`,
          priority: 'medium',
          icon: '❓'
        });
      }
    });

    // Age-specific tips
    if (ageCategory === 'senior') {
      tips.push({
        type: 'tip',
        title: 'Medication Review',
        message: `${personalDetails.name}, bring all your medications (including over-the-counter) to your next doctor visit for a comprehensive review.`,
        priority: 'medium',
        icon: '📋'
      });

      tips.push({
        type: 'lifestyle',
        title: 'Stay Hydrated',
        message: `${personalDetails.name}, seniors process medications differently. Drink plenty of water and watch for unusual side effects.`,
        priority: 'medium',
        icon: '💧'
      });
    }

    if (ageCategory === 'child' || ageCategory === 'adolescent') {
      tips.push({
        type: 'tip',
        title: 'Dosage Verification',
        message: `For ${personalDetails.name}, always double-check pediatric dosages with your pharmacist before giving any medication.`,
        priority: 'high',
        icon: '⚖️'
      });
    }

    // Medical history-specific tips
    if (medicalHistory.conditions.includes('Diabetes') || medicalHistory.conditions.includes('diabetes')) {
      tips.push({
        type: 'question',
        title: 'Ask Your Doctor',
        message: `${personalDetails.name}, ask your doctor: "Will these medications affect my blood sugar levels or interact with my diabetes medications?"`,
        priority: 'high',
        icon: '🩸'
      });
    }

    if (medicalHistory.conditions.includes('Hypertension') || medicalHistory.conditions.includes('hypertension')) {
      tips.push({
        type: 'tip',
        title: 'Blood Pressure Monitoring',
        message: `${personalDetails.name}, monitor your blood pressure more frequently while starting new medications, as some can affect blood pressure.`,
        priority: 'medium',
        icon: '💓'
      });
    }

    // Drug interaction tips
    if (medicalHistory.currentMedications.length > 0) {
      tips.push({
        type: 'question',
        title: 'Ask Your Pharmacist',
        message: `${personalDetails.name}, ask your pharmacist: "Can you check for interactions between my new prescription and my current medications?"`,
        priority: 'high',
        icon: '💊'
      });
    }

    // General lifestyle tips
    tips.push({
      type: 'lifestyle',
      title: 'Medication Schedule',
      message: `${personalDetails.name}, set phone alarms or use a pill organizer to help remember your medication times consistently.`,
      priority: 'low',
      icon: '📱'
    });

    // Weight-specific tips
    if (weightKg < 50 || weightKg > 100 || bmiCategory === 'obese' || bmiCategory === 'underweight') {
      tips.push({
        type: 'question',
        title: 'Ask Your Doctor',
        message: `${personalDetails.name}, ask your doctor: "Should my medication dosage be adjusted based on my current weight and BMI?"`,
        priority: 'medium',
        icon: '⚖️'
      });
    }

    // Sort tips by priority and return top 3-4
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return tips
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 4);
  }
}