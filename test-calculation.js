// 出産手当金計算の簡易テスト

// ESモジュールではないので、直接計算ロジックをテスト
const STANDARD_MONTHLY_REMUNERATION_TABLE = [
  58000, 68000, 78000, 88000, 98000,
  104000, 110000, 118000, 126000, 134000,
  142000, 150000, 160000, 170000, 180000,
  190000, 200000, 220000, 240000, 260000,
  280000, 300000, 320000, 340000, 360000,
  380000, 410000, 440000, 470000, 500000,
];

function getStandardMonthlyRemuneration(salary) {
  if (salary < STANDARD_MONTHLY_REMUNERATION_TABLE[0]) {
    return STANDARD_MONTHLY_REMUNERATION_TABLE[0];
  }
  
  const maxRemuneration = STANDARD_MONTHLY_REMUNERATION_TABLE[
    STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1
  ];
  if (salary >= maxRemuneration) {
    return maxRemuneration;
  }
  
  for (let i = 0; i < STANDARD_MONTHLY_REMUNERATION_TABLE.length - 1; i++) {
    const current = STANDARD_MONTHLY_REMUNERATION_TABLE[i];
    const next = STANDARD_MONTHLY_REMUNERATION_TABLE[i + 1];
    const midpoint = (current + next) / 2;
    
    if (salary < midpoint) {
      return current;
    }
  }
  
  return maxRemuneration;
}

function calculateMaternityBenefit(salary, isMultiple = false) {
  const standardRemuneration = getStandardMonthlyRemuneration(salary);
  const standardDailyWage = Math.floor(standardRemuneration / 30);
  const benefitDailyAmount = Math.floor(standardDailyWage * (2/3));
  
  const prenatalDays = isMultiple ? 98 : 42;
  const postnatalDays = 56;
  const totalDays = prenatalDays + postnatalDays;
  
  const totalBenefit = benefitDailyAmount * totalDays;
  const monthlyEquivalent = Math.floor(benefitDailyAmount * 30.44);
  
  return {
    salary,
    standardRemuneration,
    standardDailyWage,
    benefitDailyAmount,
    prenatalDays,
    postnatalDays,
    totalDays,
    totalBenefit,
    monthlyEquivalent
  };
}

// テストケース
console.log('=== 出産手当金計算テスト ===\n');

const testCases = [
  { salary: 200000, description: '月給20万円（単胎妊娠）' },
  { salary: 300000, description: '月給30万円（単胎妊娠）' },
  { salary: 300000, isMultiple: true, description: '月給30万円（多胎妊娠）' },
  { salary: 400000, description: '月給40万円（単胎妊娠）' },
  { salary: 500000, description: '月給50万円（単胎妊娠）' }
];

testCases.forEach((testCase, index) => {
  const result = calculateMaternityBenefit(testCase.salary, testCase.isMultiple);
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   月額総支給額: ${result.salary.toLocaleString()}円`);
  console.log(`   標準報酬月額: ${result.standardRemuneration.toLocaleString()}円`);
  console.log(`   標準報酬日額: ${result.standardDailyWage.toLocaleString()}円`);
  console.log(`   出産手当金日額: ${result.benefitDailyAmount.toLocaleString()}円`);
  console.log(`   支給期間: 産前${result.prenatalDays}日 + 産後${result.postnatalDays}日 = ${result.totalDays}日`);
  console.log(`   総支給額: ${result.totalBenefit.toLocaleString()}円`);
  console.log(`   月換算額: ${result.monthlyEquivalent.toLocaleString()}円`);
  console.log('');
});

console.log('=== 計算ロジック確認完了 ===');