'use client';

import { formatCurrency, formatPercent } from '../utils/formatter';
import './IncomeComparison.css';

interface IncomeComparisonProps {
  currentNetIncome: number;
  monthlyBenefitEquivalent: number;
  maintenanceRate: number;
}

export default function IncomeComparison({
  currentNetIncome,
  monthlyBenefitEquivalent,
  maintenanceRate
}: IncomeComparisonProps) {
  return (
    <div className="income-comparison">
      <h3 className="income-comparison__title">現在との比較</h3>
      
      <div className="income-comparison__chart">
        <div className="income-comparison__bar-container">
          <div className="income-comparison__bar-label">通常時の手取り</div>
          <div className="income-comparison__bar">
            <div 
              className="income-comparison__bar-fill income-comparison__bar-fill--current" 
              style={{ width: '100%' }}
            ></div>
          </div>
          <div className="income-comparison__bar-value">{formatCurrency(currentNetIncome)}</div>
          <div className="income-comparison__bar-percentage">100%</div>
        </div>

        <div className="income-comparison__bar-container">
          <div className="income-comparison__bar-label">手当金（月換算）</div>
          <div className="income-comparison__bar">
            <div 
              className="income-comparison__bar-fill income-comparison__bar-fill--benefit" 
              style={{ width: `${Math.min(maintenanceRate, 100)}%` }}
            ></div>
          </div>
          <div className="income-comparison__bar-value">{formatCurrency(monthlyBenefitEquivalent)}</div>
          <div className="income-comparison__bar-percentage">{formatPercent(maintenanceRate)}</div>
        </div>
      </div>

      <div className="income-comparison__summary">
        <div className="income-comparison__summary-item">
          <span className="income-comparison__summary-label">手取り維持率</span>
          <span className={`income-comparison__summary-value ${
            maintenanceRate >= 80 ? 'income-comparison__summary-value--good' :
            maintenanceRate >= 60 ? 'income-comparison__summary-value--fair' :
            'income-comparison__summary-value--low'
          }`}>
            {formatPercent(maintenanceRate)}
          </span>
        </div>
      </div>

      <div className="income-comparison__notes">
        <h4 className="income-comparison__notes-title">ポイント</h4>
        <ul className="income-comparison__notes-list">
          <li>出産手当金は非課税のため、実質的な手取り率が高くなります</li>
          <li>産前産後休業期間中は社会保険料も免除されます</li>
          <li>月換算は30日で計算した目安です</li>
        </ul>
      </div>
    </div>
  );
}