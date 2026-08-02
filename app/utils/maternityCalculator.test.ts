import { describe, it, expect, vi, afterEach } from 'vitest';
import { calculateMaternity, validateMaternityInput } from './maternityCalculator';
import { STANDARD_MONTHLY_REMUNERATION_TABLE } from './constants';
import type { MaternityInput } from '../types';

const DUE_DATE = new Date(2026, 5, 1);

function input(overrides: Partial<MaternityInput> = {}): MaternityInput {
  return {
    salary: 300000,
    dueDate: DUE_DATE,
    pregnancyType: 'single',
    ...overrides,
  };
}

describe('標準報酬月額の等級判定', () => {
  // 健康保険の標準報酬月額表は、隣り合う等級の中間値が境界になっている。
  // 例: 58,000 と 68,000 の境界は 63,000（63,000 未満は 58,000 等級）。
  it('隣接する等級の中間値が境界になる', () => {
    expect(calculateMaternity(input({ salary: 62_999 })).standardMonthlyRemuneration).toBe(58_000);
    expect(calculateMaternity(input({ salary: 63_000 })).standardMonthlyRemuneration).toBe(68_000);
    expect(calculateMaternity(input({ salary: 72_999 })).standardMonthlyRemuneration).toBe(68_000);
    expect(calculateMaternity(input({ salary: 73_000 })).standardMonthlyRemuneration).toBe(78_000);
  });

  it('表の下限を下回る場合は最低等級に丸める', () => {
    expect(calculateMaternity(input({ salary: 1 })).standardMonthlyRemuneration).toBe(58_000);
    expect(calculateMaternity(input({ salary: 57_999 })).standardMonthlyRemuneration).toBe(58_000);
  });

  it('表の上限を超える場合は最高等級で頭打ちになる', () => {
    const max = STANDARD_MONTHLY_REMUNERATION_TABLE[STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1];

    expect(calculateMaternity(input({ salary: max })).standardMonthlyRemuneration).toBe(max);
    expect(calculateMaternity(input({ salary: max * 3 })).standardMonthlyRemuneration).toBe(max);
  });

  it('判定結果は必ず等級表に載っている値になる', () => {
    for (let salary = 50_000; salary <= 1_500_000; salary += 7_331) {
      const { standardMonthlyRemuneration } = calculateMaternity(input({ salary }));
      expect(STANDARD_MONTHLY_REMUNERATION_TABLE).toContain(standardMonthlyRemuneration);
    }
  });
});

describe('出産手当金の日額', () => {
  it('標準報酬日額は標準報酬月額の30分の1', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    expect(result.standardMonthlyRemuneration).toBe(300_000);
    expect(result.standardDailyWage).toBe(Math.floor(300_000 / 30));
  });

  it('支給日額は標準報酬日額の3分の2', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    // 300,000 / 30 = 10,000 → 10,000 × 2/3 = 6,666（円未満切り捨て）
    expect(result.standardDailyWage).toBe(10_000);
    expect(result.benefitDailyAmount).toBe(6_666);
  });

  it('日額は標準報酬日額を超えない', () => {
    for (let salary = 60_000; salary <= 1_400_000; salary += 13_577) {
      const result = calculateMaternity(input({ salary }));
      expect(result.benefitDailyAmount).toBeLessThan(result.standardDailyWage);
    }
  });
});

describe('支給総額', () => {
  it('総額 = 日額 × 支給日数', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    expect(result.totalDays).toBe(98);
    expect(result.totalBenefit).toBe(result.benefitDailyAmount * result.totalDays);
  });

  it('多胎は単胎より支給日数が56日多く、日額は変わらない', () => {
    const single = calculateMaternity(input({ pregnancyType: 'single' }));
    const multiple = calculateMaternity(input({ pregnancyType: 'multiple' }));

    expect(multiple.totalDays - single.totalDays).toBe(56);
    // 多胎で増えるのは期間だけ。1日あたりの金額は同じ。
    expect(multiple.benefitDailyAmount).toBe(single.benefitDailyAmount);
    expect(multiple.totalBenefit).toBeGreaterThan(single.totalBenefit);
  });

  it('月換算額は日額×30', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));
    expect(result.monthlyEquivalent).toBe(result.benefitDailyAmount * 30);
  });

  it('給与が上がれば支給総額も下がらない（単調非減少）', () => {
    let previous = 0;
    for (let salary = 58_000; salary <= 1_400_000; salary += 11_113) {
      const { totalBenefit } = calculateMaternity(input({ salary }));
      expect(totalBenefit).toBeGreaterThanOrEqual(previous);
      previous = totalBenefit;
    }
  });

  it('上限等級を超えて給与が増えても支給額は増えない', () => {
    const max = STANDARD_MONTHLY_REMUNERATION_TABLE[STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1];
    const atCap = calculateMaternity(input({ salary: max }));
    const aboveCap = calculateMaternity(input({ salary: max * 2 }));

    expect(aboveCap.totalBenefit).toBe(atCap.totalBenefit);
  });
});

describe('現在の手取りとの比較', () => {
  it('手取りは額面より小さい（社会保険料と税が引かれている）', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    expect(result.currentNetIncome).toBeGreaterThan(0);
    expect(result.currentNetIncome).toBeLessThan(300_000);
  });

  it('維持率は月換算額と手取りの比率', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    expect(result.maintenanceRate).toBe(
      Math.round((result.monthlyEquivalent / result.currentNetIncome) * 100),
    );
  });

  it('出産手当金は非課税のため、額面の3分の2でも手取り比では8割前後を維持する', () => {
    const result = calculateMaternity(input({ salary: 300_000 }));

    // 額面比では 2/3（約67%）だが、手取り比ではそれより高くなる。
    expect(result.maintenanceRate).toBeGreaterThan(67);
    expect(result.maintenanceRate).toBeLessThan(100);
  });
});

describe('validateMaternityInput', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function futureDate(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d;
  }

  it('正しい入力ならエラーなし', () => {
    expect(validateMaternityInput(300_000, futureDate(), 'single')).toEqual([]);
  });

  it('給与未入力はエラー', () => {
    const errors = validateMaternityInput(0, futureDate(), 'single');
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'salary', type: 'error' }),
    );
  });

  it('給与が低すぎる場合は警告（エラーではない）', () => {
    const errors = validateMaternityInput(50_000, futureDate(), 'single');
    const salaryError = errors.find((e) => e.field === 'salary');

    expect(salaryError?.type).toBe('warning');
  });

  it('給与が高すぎる場合はエラー', () => {
    const errors = validateMaternityInput(5_000_000, futureDate(), 'single');
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'salary', type: 'error' }),
    );
  });

  it('出産予定日が未選択ならエラー', () => {
    const errors = validateMaternityInput(300_000, null, 'single');
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'dueDate', type: 'error' }),
    );
  });

  it('過去の出産予定日はエラー', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));

    const errors = validateMaternityInput(300_000, new Date(2025, 0, 1), 'single');
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'dueDate', type: 'error' }),
    );
  });

  it('妊娠タイプが不正ならエラー', () => {
    const errors = validateMaternityInput(300_000, futureDate(), 'unknown');
    expect(errors).toContainEqual(
      expect.objectContaining({ field: 'pregnancyType', type: 'error' }),
    );
  });
});
