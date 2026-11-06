"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Button } from "./button";
import { cn } from "../../lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  faqsLeft: FAQItem[];
  faqsRight: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = "Frequently asked questions",
  subtitle = "Have questions?",
  description = "Get instant answers to the most common questions about Revia, product setup, and features.",
  buttonLabel = "Browse All FAQs",
  onButtonClick,
  faqsLeft,
  faqsRight,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn("w-full max-w-6xl mx-auto py-12 px-6 lg:px-8", className)} id="faq">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-black uppercase tracking-widest text-[#5844A8] bg-purple-100/70 border border-purple-200/50 inline-block px-4 py-1.5 rounded-full mb-4">
          {subtitle}
        </p>
        <h2 className="text-4xl lg:text-5xl font-black text-[#1E1548] mb-6">
          {title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8 font-medium">
          {description}
        </p>
        {onButtonClick && (
          <Button variant="default" size="lg" className="rounded-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#5844A8] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white shadow-lg shadow-purple-500/25 cursor-pointer" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        )}
      </div>

      {/* FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-left">
        {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
          <Accordion
            key={columnIndex}
            type="single"
            collapsible
            className="space-y-6"
          >
            {faqColumn.map((faq, i) => (
              <div key={i} className="mb-4">
                <AccordionItem value={`item-${columnIndex}-${i}`} className="border-none">
                  <AccordionTrigger className="bg-white px-6 rounded-2xl border border-purple-50 hover:border-purple-200 hover:no-underline text-lg hover:text-[#5844A8] text-[#1E1548] shadow-sm hover:shadow-md transition-all data-[state=open]:border-purple-300 data-[state=open]:text-[#5844A8] data-[state=open]:shadow-md">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pt-4 px-6 pb-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
