'use client';

import { formatCurrency } from '../utils/formatter';
import './BenefitCalculation.css';

interface BenefitCalculationProps {
  standardDailyWage: number;
  benefitDailyAmount: number;
  totalBenefit: number;
}

export default function BenefitCalculation({
  standardDailyWage,
  benefitDailyAmount,
  totalBenefit
}: BenefitCalculationProps) {
  return (
    <div className="benefit-calculation">
      <h3 className="benefit-calculation__title">出産手当金</h3>
      
      <div className="benefit-calculation__details">
        <div className="benefit-calculation__row">
          <span className="benefit-calculation__label">標準報酬日額</span>
          <span className="benefit-calculation__value">{formatCurrency(standardDailyWage)}</span>
        </div>
        
        <div className="benefit-calculation__row">
          <span className="benefit-calculation__label">出産手当金日額</span>
          <span className="benefit-calculation__value benefit-calculation__value--highlight">
            {formatCurrency(benefitDailyAmount)}
          </span>
          <span className="benefit-calculation__note">（標準報酬日額の2/3）</span>
        </div>
      </div>

      <div className="benefit-calculation__separator">
        <div className="benefit-calculation__separator-line"></div>
        <span className="benefit-calculation__separator-text">総支給額</span>
        <div className="benefit-calculation__separator-line"></div>
      </div>

      <div className="benefit-calculation__total">
        <span className="benefit-calculation__total-value">{formatCurrency(totalBenefit)}</span>
      </div>

      <div className="benefit-calculation__tax-info">
        <div className="benefit-calculation__tax-badge">非課税</div>
        <p className="benefit-calculation__tax-description">
          出産手当金は所得税・住民税が非課税です
        </p>
      </div>
    </div>
  );
}