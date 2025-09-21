import React, { useState } from "react";
import parse from "html-react-parser";
import { ChevronDown, ChevronRight } from "lucide-react";

const FAQAccordion = ({ faqHtml }) => {
  const parser = new DOMParser();
  const faqId = "heading-faq";
  const doc = parser.parseFromString(faqHtml, "text/html");
  const faqNodes = doc.querySelectorAll("p strong");

  // Add FAQ heading ID
  const faqHeading = doc.querySelector("h2");
  if (faqHeading) {
    faqHeading.setAttribute("id", faqId);
  }

  const faqs = Array.from(faqNodes).map((q) => {
    const question = q.textContent.trim();
    const answer = q.parentElement.innerHTML
      .replace(q.outerHTML, "") // remove question part
      .trim();
    return { question, answer };
  });
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">FAQ's</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-2">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full text-left font-medium text-lg"
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {openIndex === index && (
              <div className="mt-2 text-gray-600">{parse(faq.answer)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
