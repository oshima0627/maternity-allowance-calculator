import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  calculatePrenatalPeriod,
  calculatePostnatalPeriod,
  calculateTotalDays,
  isValidDueDate,
  parseDate,
} from './dateCalculations';

/** 日付を YYYY-MM-DD に落として比較するためのヘルパー。 */
function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('calculateTotalDays', () => {
  // 健康保険法 第102条: 産前42日（多胎98日）＋産後56日。
  it('単胎は産前42日＋産後56日で98日', () => {
    expect(calculateTotalDays(false)).toBe(98);
  });

  it('多胎は産前98日＋産後56日で154日', () => {
    expect(calculateTotalDays(true)).toBe(154);
  });
});

describe('calculatePrenatalPeriod', () => {
  it('単胎は出産予定日を最終日とする42日間', () => {
    const period = calculatePrenatalPeriod(new Date(2026, 5, 1), false);

    expect(period.days).toBe(42);
    expect(ymd(period.end)).toBe('2026-06-01');
    // 予定日を含めて42日なので、開始日は 41 日前。
    expect(ymd(period.start)).toBe('2026-04-21');
  });

  it('多胎は98日間になり、開始日がその分だけ前倒しになる', () => {
    const period = calculatePrenatalPeriod(new Date(2026, 5, 1), true);

    expect(period.days).toBe(98);
    expect(ymd(period.end)).toBe('2026-06-01');
    expect(ymd(period.start)).toBe('2026-02-24');
  });

  it('開始日から終了日までの実日数が days と一致する', () => {
    for (const isMultiple of [false, true]) {
      const period = calculatePrenatalPeriod(new Date(2026, 5, 1), isMultiple);
      const actualDays =
        (period.end.getTime() - period.start.getTime()) / 86_400_000 + 1;
      expect(actualDays).toBe(period.days);
    }
  });

  it('月をまたぐ予定日でも日数がずれない', () => {
    // 3/1 起点だと 2 月の日数（うるう年判定）を跨ぐ。
    const period = calculatePrenatalPeriod(new Date(2028, 2, 1), false);
    expect(ymd(period.start)).toBe('2028-01-20');
    expect(period.days).toBe(42);
  });
});

describe('calculatePostnatalPeriod', () => {
  it('出産日の翌日から56日間', () => {
    const period = calculatePostnatalPeriod(new Date(2026, 5, 1));

    expect(period.days).toBe(56);
    expect(ymd(period.start)).toBe('2026-06-02');
    expect(ymd(period.end)).toBe('2026-07-27');
  });

  it('開始日から終了日までの実日数が days と一致する', () => {
    const period = calculatePostnatalPeriod(new Date(2026, 5, 1));
    const actualDays =
      (period.end.getTime() - period.start.getTime()) / 86_400_000 + 1;
    expect(actualDays).toBe(period.days);
  });

  it('産前期間の終了日の翌日から産後期間が始まる（間に空きがない）', () => {
    const dueDate = new Date(2026, 5, 1);
    const prenatal = calculatePrenatalPeriod(dueDate, false);
    const postnatal = calculatePostnatalPeriod(dueDate);

    const gap =
      (postnatal.start.getTime() - prenatal.end.getTime()) / 86_400_000;
    expect(gap).toBe(1);
  });
});

describe('isValidDueDate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('今日から1年以内の日付は有効', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));

    expect(isValidDueDate(new Date(2026, 5, 1))).toBe(true);
  });

  it('過去の日付は無効', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));

    expect(isValidDueDate(new Date(2025, 11, 31))).toBe(false);
  });

  it('1年より先の日付は無効', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));

    expect(isValidDueDate(new Date(2027, 2, 1))).toBe(false);
  });
});

describe('parseDate', () => {
  it('ISO 形式の文字列を Date に変換する', () => {
    const parsed = parseDate('2026-06-01');
    expect(parsed).toBeInstanceOf(Date);
    expect(Number.isNaN(parsed?.getTime())).toBe(false);
  });

  it('空文字は null', () => {
    expect(parseDate('')).toBeNull();
  });

  it('日付として解釈できない文字列は null', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });
});
