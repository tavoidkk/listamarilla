'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl border shadow-sm transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-amber-400 shadow-md'
                : 'border-slate-200 hover:shadow-md hover:border-amber-300'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex cursor-pointer items-center justify-between gap-4 p-5 text-left select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
            >
              <span className="text-base font-bold text-slate-900">{item.question}</span>
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900 transition-transform duration-500 ease-out ${
                  isOpen ? 'rotate-45' : 'rotate-0'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12M6 12h12" />
                </svg>
              </span>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <div
                  className={`px-5 text-slate-600 leading-relaxed transition-all duration-500 ${
                    isOpen ? 'pb-5 opacity-100 translate-y-0' : 'pb-0 opacity-0 -translate-y-2'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}