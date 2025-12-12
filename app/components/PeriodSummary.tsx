'use client';

import { formatDateShort } from '../utils/formatter';
import type { Period } from '../types';
import './PeriodSummary.css';

interface PeriodSummaryProps {
  prenatalPeriod: Period;
  postnatalPeriod: Period;
  totalDays: number;
  isMultiple: boolean;
}

export default function PeriodSummary({
  prenatalPeriod,
  postnatalPeriod,
  totalDays,
  isMultiple
}: PeriodSummaryProps) {
  return (
    <div className="period-summary">
      <h3 className="period-summary__title">支給期間</h3>
      
      <div className="period-summary__periods">
        <div className="period-summary__period period-summary__period--prenatal">
          <div className="period-summary__period-header">
            <span className="period-summary__period-label">産前休業</span>
            {isMultiple && (
              <span className="period-summary__multiple-badge">多胎妊娠</span>
            )}
          </div>
          <div className="period-summary__period-dates">
            {formatDateShort(prenatalPeriod.start)} ～ {formatDateShort(prenatalPeriod.end)}
          </div>
          <div className="period-summary__period-days">
            {prenatalPeriod.days}日間
          </div>
        </div>

        <div className="period-summary__period period-summary__period--postnatal">
          <div className="period-summary__period-header">
            <span className="period-summary__period-label">産後休業</span>
          </div>
          <div className="period-summary__period-dates">
            {formatDateShort(postnatalPeriod.start)} ～ {formatDateShort(postnatalPeriod.end)}
          </div>
          <div className="period-summary__period-days">
            {postnatalPeriod.days}日間
          </div>
        </div>
      </div>

      <div className="period-summary__total">
        <div className="period-summary__total-label">合計支給期間</div>
        <div className="period-summary__total-value">{totalDays}日間</div>
      </div>

      <div className="period-summary__note">
        {isMultiple ? (
          <p>多胎妊娠のため、産前休業期間が98日間に延長されています。</p>
        ) : (
          <p>実際の出産日が予定日と異なる場合、支給期間は調整されます。</p>
        )}
      </div>
    </div>
  );
}