'use client'

/**
 * 入力フォームコンポーネント
 * ユーザーの月額総支給額、出産予定日、妊娠タイプを入力
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { validateMaternityInput } from '../utils/maternityCalculator'
import { parseDate } from '../utils/dateCalculations'
import { formatNumber, parseFormattedNumber } from '../utils/formatter'
import { DEBOUNCE_TIME } from '../utils/constants'
import type { MaternityInput, ValidationError } from '../types'
import './InputForm.css'

interface InputFormProps {
  onCalculate: (input: MaternityInput) => void;
  initialSalary?: number;
  initialDueDate?: string;
  initialPregnancyType?: 'single' | 'multiple';
}

export default function InputForm({
  onCalculate,
  initialSalary = 0,
  initialDueDate = '',
  initialPregnancyType = 'single'
}: InputFormProps) {
  const [salary, setSalary] = useState<string>(
    initialSalary > 0 ? String(initialSalary) : ''
  )
  const [dueDate, setDueDate] = useState<string>(initialDueDate)
  const [pregnancyType, setPregnancyType] = useState<'single' | 'multiple'>(initialPregnancyType)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [error, setError] = useState<ValidationError | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * 計算実行のデバウンス処理
   */
  const executeCalculation = useCallback(() => {
    const salaryNumber = parseFloat(salary) || 0
    const dueDateObj = parseDate(dueDate)
    
    if (!dueDateObj) return

    const validationErrors = validateMaternityInput(salaryNumber, dueDateObj, pregnancyType)
    setErrors(validationErrors)

    // エラーがない場合のみ計算実行
    if (validationErrors.filter(error => error.type === 'error').length === 0) {
      const input: MaternityInput = {
        salary: salaryNumber,
        dueDate: dueDateObj,
        pregnancyType
      }
      onCalculate(input)
    }
  }, [salary, dueDate, pregnancyType, onCalculate])

  /**
   * デバウンス付きの計算実行
   */
  const debouncedCalculate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      executeCalculation()
    }, DEBOUNCE_TIME)
  }, [executeCalculation])

  /**
   * 給与入力の変更処理
   */
  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSalary(value)
  }

  /**
   * 給与入力のブラー処理（フォーカスアウト時の処理）
   */
  const handleSalaryBlur = () => {
    // number型の入力フィールドなのでフォーマット処理は不要
  }

  /**
   * 出産予定日の変更処理
   */
  const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(event.target.value)
  }

  /**
   * 妊娠タイプ選択の変更処理
   */
  const handlePregnancyTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as 'single' | 'multiple'
    setPregnancyType(newType)
  }

  /**
   * 入力値が変更された時のデバウンス実行
   */
  useEffect(() => {
    if (salary && dueDate && pregnancyType) {
      debouncedCalculate()
    }
  }, [salary, dueDate, pregnancyType, debouncedCalculate])

  /**
   * コンポーネントのクリーンアップ
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  /**
   * 特定フィールドのエラーを取得
   */
  const getFieldErrors = (fieldName: string) => {
    return errors.filter(error => error.field === fieldName)
  }

  return (
    <section className="input-form">
      <h2>給与情報入力</h2>
      
      <div className="form-group">
        <label htmlFor="salary">
          月額総支給額（円）
          <span className="required">*</span>
        </label>
        <div className="input-wrapper">
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={handleSalaryChange}
            onBlur={handleSalaryBlur}
            min="0"
            max="2000000"
            step="1000"
            placeholder="例: 300000"
            aria-label="月額総支給額"
            aria-describedby={error ? 'salary-error' : undefined}
            className={error?.field === 'salary' ? 'has-error' : ''}
          />
          <span className="input-unit">円</span>
        </div>
        <p id="salary-help" className="form-help">
          社会保険に加入している方の月額総支給額を入力してください
        </p>
        {getFieldErrors('salary').map((error, index) => (
          <p 
            key={index}
            id="salary-error"
            className={`error-message ${error.type}`}
            role="alert"
          >
            {error.message}
          </p>
        ))}
      </div>
      
      <div className="form-group">
        <label htmlFor="dueDate">
          出産予定日
          <span className="required">*</span>
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={handleDueDateChange}
          aria-label="出産予定日"
          aria-describedby={getFieldErrors('dueDate').length > 0 ? 'dueDate-error' : 'dueDate-help'}
          className={getFieldErrors('dueDate').length > 0 ? 'has-error' : ''}
        />
        <p id="dueDate-help" className="form-help">
          予定日が変更になった場合も、実際の出産日で調整されます
        </p>
        {getFieldErrors('dueDate').map((error, index) => (
          <p 
            key={index}
            id="dueDate-error"
            className={`error-message ${error.type}`}
            role="alert"
          >
            {error.message}
          </p>
        ))}
      </div>
      
      <div className="form-group">
        <fieldset>
          <legend>
            妊娠タイプ
            <span className="required">*</span>
          </legend>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="pregnancyType"
                value="single"
                checked={pregnancyType === 'single'}
                onChange={handlePregnancyTypeChange}
                aria-describedby="pregnancyType-help"
              />
              <span className="radio-text">単胎妊娠（1人）</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="pregnancyType"
                value="multiple"
                checked={pregnancyType === 'multiple'}
                onChange={handlePregnancyTypeChange}
                aria-describedby="pregnancyType-help"
              />
              <span className="radio-text">多胎妊娠（双子以上）</span>
            </label>
          </div>
          <p id="pregnancyType-help" className="form-help">
            多胎妊娠の場合、産前休業期間が98日に延長されます
          </p>
          {getFieldErrors('pregnancyType').map((error, index) => (
            <p 
              key={index}
              className={`error-message ${error.type}`}
              role="alert"
            >
              {error.message}
            </p>
          ))}
        </fieldset>
      </div>
      
      <div className="form-status">
        {salary && dueDate && parseFloat(salary) > 0 ? (
          <p className="status-message success">
            ✓ 入力完了 - 計算結果が下に表示されます
          </p>
        ) : (
          <p className="status-message info">
            月額総支給額と出産予定日を入力すると自動で計算されます
          </p>
        )}
      </div>
    </section>
  )
}