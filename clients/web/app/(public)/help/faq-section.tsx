"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/primitives/accordion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
  defaultOpen?: boolean;
}

export function FAQSection({ title, faqs, defaultOpen = false }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    defaultOpen ? [faqs[0]?.id] : []
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-2"
      >
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left hover:no-underline py-4">
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4">
              <p className="whitespace-pre-line">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
