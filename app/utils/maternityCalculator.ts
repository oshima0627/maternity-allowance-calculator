/**
 * 出産手当金計算ロジック
 * 厚生労働省の公式な計算方法に基づく
 */

import {
  STANDARD_MONTHLY_REMUNERATION_TABLE,
  INSURANCE_RATES,
  TAX_CONSTANTS,
  MATERNITY_CONSTANTS,
  VALIDATION_LIMITS,
} from './constants';
import { 
  calculatePrenatalPeriod, 
  calculatePostnatalPeriod, 
  calculateTotalDays,
  isValidDueDate 
} from './dateCalculations';
import type {
  MaternityInput,
  MaternityResult,
  CurrentIncome,
  SocialInsurance,
  Tax,
  ValidationError,
} from '../types';

/**
 * 標準報酬月額を取得
 * 月額総支給額を標準報酬月額等級表から最も近い等級に変換
 */
function getStandardMonthlyRemuneration(salary: number): number {
  // 最小値より小さい場合
  if (salary < STANDARD_MONTHLY_REMUNERATION_TABLE[0]) {
    return STANDARD_MONTHLY_REMUNERATION_TABLE[0];
  }
  
  // 最大値より大きい場合
  const maxRemuneration = STANDARD_MONTHLY_REMUNERATION_TABLE[
    STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1
  ];
  if (salary >= maxRemuneration) {
    return maxRemuneration;
  }
  
  // 該当する等級を探す
  for (let i = 0; i < STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1; i++) {
    const current = STANDARD_MONTHLY_REMUNERATION_TABLE[i];
    const next = STANDARD_MONTHLY_REMUNERATION_TABLE[i + 1];
    
    // 現在の等級と次の等級の中間値
    const midpoint = (current + next) / 2;
    
    if (salary < midpoint) {
      return current;
    }
  }
  
  return maxRemuneration;
}

/**
 * 社会保険料を計算（現在の手取り計算用）
 * 40歳未満想定で介護保険料は0
 */
function calculateSocialInsurance(salary: number): SocialInsurance {
  const standardRemuneration = getStandardMonthlyRemuneration(salary);
  
  // 健康保険料(労働者負担分)
  const healthInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.health / 2
  );
  
  // 介護保険料(40歳未満想定で0)
  const careInsurance = 0;
  
  // 厚生年金保険料(労働者負担分)
  const pensionInsurance = Math.floor(
    standardRemuneration * INSURANCE_RATES.pension / 2
  );
  
  // 雇用保険料(労働者負担分)
  const employmentInsurance = Math.floor(
    salary * INSURANCE_RATES.employment
  );
  
  const total = healthInsurance + careInsurance + pensionInsurance + employmentInsurance;
  
  return {
    healthInsurance,
    careInsurance,
    pensionInsurance,
    employmentInsurance,
    total,
  };
}

/**
 * 給与所得控除を計算
 */
function calculateSalaryIncomeDeduction(annualIncome: number): number {
  const ranges = TAX_CONSTANTS.salaryDeductionRanges;
  
  for (const range of ranges) {
    if (annualIncome <= range.max) {
      if (range.fixed !== undefined) {
        return range.fixed;
      } else {
        return Math.floor(annualIncome * range.rate - range.deduction);
      }
    }
  }
  
  // 最後の範囲（上限なし）
  const lastRange = ranges[ranges.length - 1];
  return lastRange.fixed !== undefined ? lastRange.fixed : Math.floor(annualIncome * lastRange.rate - (lastRange.deduction || 0));
}

/**
 * 所得税を計算（復興特別所得税含む）
 */
function calculateIncomeTaxFromTaxableIncome(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  const ranges = TAX_CONSTANTS.incomeTaxRanges;
  
  for (const range of ranges) {
    if (taxableIncome <= range.max) {
      const tax = Math.floor(taxableIncome * range.rate - (range.deduction || 0));
      // 復興特別所得税（2.1%）を加算
      return Math.floor(tax * 1.021);
    }
  }
  
  // 最後の範囲（上限なし）
  const lastRange = ranges[ranges.length - 1];
  const tax = Math.floor(taxableIncome * lastRange.rate - (lastRange.deduction || 0));
  return Math.floor(tax * 1.021);
}

/**
 * 税金を計算（正確な計算）
 * 給与所得控除・社会保険料控除・基礎控除を考慮した正確な計算
 */
function calculateTax(salary: number, socialInsurance: SocialInsurance): Tax {
  const annualSalary = salary * 12;
  const annualSocialInsurance = socialInsurance.total * 12;
  
  // 1. 給与所得の計算
  const salaryDeduction = calculateSalaryIncomeDeduction(annualSalary);
  const salaryIncome = Math.max(0, annualSalary - salaryDeduction);
  
  // 2. 所得控除の計算（基礎控除 + 社会保険料控除）
  const totalDeductions = TAX_CONSTANTS.basicDeduction + annualSocialInsurance;
  
  // 3. 課税所得の計算（所得税）
  const taxableIncomeForIncomeTax = Math.max(0, salaryIncome - totalDeductions);
  
  // 4. 所得税の計算
  const annualIncomeTax = calculateIncomeTaxFromTaxableIncome(taxableIncomeForIncomeTax);
  
  // 5. 住民税の計算
  // 住民税の基礎控除は所得税より5万円少ない
  const residentTaxDeductions = TAX_CONSTANTS.residentBasicDeduction + annualSocialInsurance;
  const taxableIncomeForResidentTax = Math.max(0, salaryIncome - residentTaxDeductions);
  
  // 住民税 = 均等割 + 所得割
  const annualResidentTax = TAX_CONSTANTS.residentEqualTax + 
    Math.floor(taxableIncomeForResidentTax * TAX_CONSTANTS.residentIncomeRate);
  
  // 月額に変換
  const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
  const monthlyResidentTax = Math.floor(annualResidentTax / 12);
  
  return {
    incomeTax: monthlyIncomeTax,
    residentTax: monthlyResidentTax,
    total: monthlyIncomeTax + monthlyResidentTax,
  };
}

/**
 * 現在の収支を計算
 */
function calculateCurrentIncome(salary: number): CurrentIncome {
  const socialInsurance = calculateSocialInsurance(salary);
  const tax = calculateTax(salary, socialInsurance);
  const netIncome = salary - socialInsurance.total - tax.total;
  
  return {
    grossSalary: salary,
    socialInsurance,
    tax,
    netIncome,
  };
}

/**
 * 出産手当金を計算
 */
function calculateMaternityBenefit(input: MaternityInput): {
  standardDailyWage: number;
  benefitDailyAmount: number;
  totalDays: number;
  totalBenefit: number;
  monthlyEquivalent: number;
} {
  const standardRemuneration = getStandardMonthlyRemuneration(input.salary);
  
  // 標準報酬日額 = 標準報酬月額 ÷ 30
  const standardDailyWage = Math.floor(standardRemuneration / 30);
  
  // 出産手当金日額 = 標準報酬日額 × 2/3
  const benefitDailyAmount = Math.floor(standardDailyWage * MATERNITY_CONSTANTS.BENEFIT_RATE);
  
  // 総支給日数
  const totalDays = calculateTotalDays(input.pregnancyType === 'multiple');
  
  // 総支給額
  const totalBenefit = benefitDailyAmount * totalDays;
  
  // 月換算額 (30日で計算)
  const monthlyEquivalent = Math.floor(benefitDailyAmount * 30);
  
  return {
    standardDailyWage,
    benefitDailyAmount,
    totalDays,
    totalBenefit,
    monthlyEquivalent,
  };
}

/**
 * メイン計算関数
 */
export function calculateMaternity(input: MaternityInput): MaternityResult {
  const currentIncome = calculateCurrentIncome(input.salary);
  const benefitCalc = calculateMaternityBenefit(input);
  
  // 産前・産後期間を計算
  const prenatalPeriod = calculatePrenatalPeriod(
    input.dueDate, 
    input.pregnancyType === 'multiple'
  );
  const postnatalPeriod = calculatePostnatalPeriod(input.dueDate);
  
  // 維持率を計算(手取りに対する手当金の割合)
  const maintenanceRate = Math.round(
    (benefitCalc.monthlyEquivalent / currentIncome.netIncome) * 100
  );
  
  return {
    input,
    standardMonthlyRemuneration: getStandardMonthlyRemuneration(input.salary),
    standardDailyWage: benefitCalc.standardDailyWage,
    benefitDailyAmount: benefitCalc.benefitDailyAmount,
    prenatalPeriod,
    postnatalPeriod,
    totalDays: benefitCalc.totalDays,
    totalBenefit: benefitCalc.totalBenefit,
    monthlyEquivalent: benefitCalc.monthlyEquivalent,
    currentNetIncome: currentIncome.netIncome,
    maintenanceRate,
  };
}

/**
 * 入力値のバリデーション
 */
export function validateMaternityInput(
  salary: number, 
  dueDate: Date | null, 
  pregnancyType: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 給与のバリデーション
  if (!salary || salary === 0) {
    errors.push({
      field: 'salary',
      message: '月額総支給額を入力してください',
      type: 'error',
    });
  } else if (salary < VALIDATION_LIMITS.salaryMin) {
    errors.push({
      field: 'salary',
      message: '金額が低すぎます。出産手当金の受給要件を満たさない可能性があります',
      type: 'warning',
    });
  } else if (salary > VALIDATION_LIMITS.salaryMax) {
    errors.push({
      field: 'salary',
      message: '金額が高すぎます。入力内容をご確認ください',
      type: 'error',
    });
  }
  
  // 出産予定日のバリデーション
  if (!dueDate) {
    errors.push({
      field: 'dueDate',
      message: '出産予定日を選択してください',
      type: 'error',
    });
  } else if (!isValidDueDate(dueDate)) {
    errors.push({
      field: 'dueDate',
      message: '出産予定日は今日以降1年以内の日付を選択してください',
      type: 'error',
    });
  }
  
  // 妊娠タイプのバリデーション
  if (!pregnancyType || (pregnancyType !== 'single' && pregnancyType !== 'multiple')) {
    errors.push({
      field: 'pregnancyType',
      message: '妊娠タイプを選択してください',
      type: 'error',
    });
  }
  
  return errors;
}