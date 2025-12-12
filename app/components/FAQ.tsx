'use client';

import { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'amount',
    question: '出産手当金はいくらもらえますか？',
    answer: '出産手当金は「標準報酬日額の3分の2」が支給されます。例えば月給30万円の場合、1日約6,667円×支給日数分が受給できます。具体的な金額は上記シミュレーターでご確認ください。'
  },
  {
    id: 'difference',
    question: '出産手当金と出産育児一時金の違いは何ですか？',
    answer: '出産手当金は産前産後休業中の給与代替（収入に応じた日額×日数分）、出産育児一時金は出産費用の補助（一律50万円の一時金）です。2つは別制度で、どちらも受給可能です。'
  },
  {
    id: 'timing',
    question: 'いつ申請して、いつもらえますか？',
    answer: '産後休業が終了してから申請可能です（産前分のみ産前休業終了後に申請も可能）。申請から振込まで通常1-2ヶ月程度かかります。'
  },
  {
    id: 'twins',
    question: '双子の場合は金額が増えますか？',
    answer: '双子など多胎妊娠の場合、支給期間が延長されます（産前98日間）が、1日あたりの金額は変わりません。結果として総額が増加します。'
  },
  {
    id: 'tax',
    question: '税金はかかりますか？',
    answer: '出産手当金は非課税です。所得税・住民税はかかりません。確定申告も不要です。'
  },
  {
    id: 'insurance',
    question: '産休中の社会保険料はどうなりますか？',
    answer: '産前産後休業期間中は健康保険料・厚生年金保険料が免除されます（本人・事業主とも）。免除期間中も被保険者資格は継続します。'
  },
  {
    id: 'part-time',
    question: 'パート・アルバイトでももらえますか？',
    answer: '健康保険の被保険者であれば雇用形態に関係なく受給できます。ただし、被保険者期間が1年以上必要な場合があります。'
  },
  {
    id: 'salary-during-leave',
    question: '産休中に給与をもらった場合はどうなりますか？',
    answer: '産休中に給与が支払われた場合、その分は出産手当金から減額されます。給与額が出産手当金を上回る場合は支給されません。'
  },
  {
    id: 'documents',
    question: '申請に必要な書類は何ですか？',
    answer: '健康保険出産手当金支給申請書、医師・助産師の証明（出産日等の証明）、事業主の証明（休業期間・給与支払状況）、本人確認書類・印鑑が必要です。'
  },
  {
    id: 'date-change',
    question: '予定日より早く・遅く生まれた場合はどうなりますか？',
    answer: '早産の場合は予定していた産前期間のうち、実際に休業した期間のみ支給されます。予定日超過の場合は実際の出産日まで産前期間が延長され支給されます。産後期間（56日）は実際の出産日から起算されます。'
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="faq">
      <h3 className="faq__title">よくある質問</h3>
      <p className="faq__description">
        出産手当金についてよくお寄せいただく質問をまとめました。
      </p>
      
      <div className="faq__list">
        {faqItems.map((item, index) => (
          <div key={item.id} className="faq__item">
            <button
              className="faq__question"
              onClick={() => toggleItem(item.id)}
              aria-expanded={openItems.has(item.id)}
              aria-controls={`faq-answer-${item.id}`}
            >
              <span className="faq__question-number">Q{index + 1}.</span>
              <span className="faq__question-text">{item.question}</span>
              <span className={`faq__question-icon ${openItems.has(item.id) ? 'faq__question-icon--open' : ''}`}>
                +
              </span>
            </button>
            
            <div
              id={`faq-answer-${item.id}`}
              className={`faq__answer ${openItems.has(item.id) ? 'faq__answer--open' : ''}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
            >
              <div className="faq__answer-content">
                <span className="faq__answer-label">A.</span>
                <p className="faq__answer-text">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="faq__note">
        <h4 className="faq__note-title">ご注意</h4>
        <p className="faq__note-text">
          このシミュレーターの計算結果は概算です。実際の支給額は、ハローワークでの正式な手続きにより確定されます。
          最新の制度変更については厚生労働省・ハローワークでご確認ください。
        </p>
      </div>
    </div>
  );
}