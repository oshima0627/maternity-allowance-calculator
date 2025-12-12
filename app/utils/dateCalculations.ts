import { MATERNITY_CONSTANTS } from './constants';
import type { Period } from '../types';

/**
 * 産前期間を計算
 * 産前休業は出産予定日を含む期間
 */
export function calculatePrenatalPeriod(dueDate: Date, isMultiple: boolean): Period {
  const prenatalDays = isMultiple 
    ? MATERNITY_CONSTANTS.PRENATAL_DAYS_MULTIPLE 
    : MATERNITY_CONSTANTS.PRENATAL_DAYS_SINGLE;
  
  // 産前休業開始日 = 出産予定日から産前日数を引いた日
  const start = new Date(dueDate);
  start.setDate(start.getDate() - prenatalDays + 1);
  
  // 産前休業終了日 = 出産予定日（含む）
  const end = new Date(dueDate);
  
  return {
    start,
    end,
    days: prenatalDays
  };
}

/**
 * 産後期間を計算
 * 産後休業は出産日の翌日から56日間
 */
export function calculatePostnatalPeriod(dueDate: Date): Period {
  // 産後休業開始日 = 出産日の翌日
  const start = new Date(dueDate);
  start.setDate(start.getDate() + 1);
  
  // 産後休業終了日 = 出産日 + 56日
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