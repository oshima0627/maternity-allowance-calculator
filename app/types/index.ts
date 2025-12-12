// 入力値の型
export interface MaternityInput {
  salary: number;
  dueDate: Date;
  pregnancyType: 'single' | 'multiple';
}

// 期間の型
export interface Period {
  start: Date;
  end: Date;
  days: number;
}

// 計算結果の型
export interface MaternityResult {
  input: MaternityInput;
  standardMonthlyRemuneration: number;
  standardDailyWage: number;
  benefitDailyAmount: number;
  prenatalPeriod: Period;
  postnatalPeriod: Period;
  totalDays: number;
  totalBenefit: number;
  monthlyEquivalent: number;
  currentNetIncome: number;
  maintenanceRate: number;
}

// 社会保険料の型（現在収入計算用）
export interface SocialInsurance {
  healthInsurance: number;
  careInsurance: number;
  pensionInsurance: number;
  employmentInsurance: number;
  total: number;
}

// 税金の型（現在収入計算用）
export interface Tax {
  incomeTax: number;
  residentTax: number;
  total: number;
}

// 現在の収支の型
export interface CurrentIncome {
  grossSalary: number;
  socialInsurance: SocialInsurance;
  tax: Tax;
  netIncome: number;
}

// バリデーションエラーの型
export interface ValidationError {
  field: 'salary' | 'dueDate' | 'pregnancyType';
  message: string;
  type: 'error' | 'warning';
}