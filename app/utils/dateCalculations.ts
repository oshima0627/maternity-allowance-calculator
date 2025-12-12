import { MATERNITY_CONSTANTS } from './constants';
import type { Period } from '../types';

/**
 * 産前期間を計算
 */
export function calculatePrenatalPeriod(dueDate: Date, isMultiple: boolean): Period {
  const prenatalDays = isMultiple 
    ? MATERNITY_CONSTANTS.PRENATAL_DAYS_MULTIPLE 
    : MATERNITY_CONSTANTS.PRENATAL_DAYS_SINGLE;
  
  const start = new Date(dueDate);
  start.setDate(start.getDate() - prenatalDays);
  
  const end = new Date(dueDate);
  end.setDate(end.getDate() - 1);
  
  return {
    start,
    end,
    days: prenatalDays
  };
}

/**
 * 産後期間を計算
 */
export function calculatePostnatalPeriod(dueDate: Date): Period {
  const start = new Date(dueDate);
  start.setDate(start.getDate() + 1);
  
  const end = new Date(dueDate);
  end.setDate(end.getDate() + MATERNITY_CONSTANTS.POSTNATAL_DAYS);
  
  return {
    start,
    end,
    days: MATERNITY_CONSTANTS.POSTNATAL_DAYS
  };
}

/**
 * 総支給期間を計算
 */
export function calculateTotalDays(isMultiple: boolean): number {
  const prenatalDays = isMultiple 
    ? MATERNITY_CONSTANTS.PRENATAL_DAYS_MULTIPLE 
    : MATERNITY_CONSTANTS.PRENATAL_DAYS_SINGLE;
  
  return prenatalDays + MATERNITY_CONSTANTS.POSTNATAL_DAYS;
}

/**
 * 日付の妥当性チェック
 */
export function isValidDueDate(dueDate: Date): boolean {
  const today = new Date();
  const maxFutureDate = new Date();
  maxFutureDate.setMonth(maxFutureDate.getMonth() + 12);
  
  // 今日以降、1年以内の日付であることをチェック
  return dueDate >= today && dueDate <= maxFutureDate;
}

/**
 * 文字列からDateオブジェクトを作成
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}