import React from "react";
import parse from "html-react-parser";
import FAQAccordion from "./FAQAccordion";
import TableOfContents from "./TableOfContents";
import { useTableOfContents } from "../hooks/useTableofContents";

const ArticleContentRenderer = ({ html }) => {
  const { tocItems, processedHtml } = useTableOfContents(html);

  // Scroll to section from TOC
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Extract FAQ separately
  const faqMatch = processedHtml.match(/<h2[^>]*>FAQ<\/h2>[\s\S]*/i);
  const faqHtml = faqMatch ? faqMatch[0] : null;

  // Remove FAQ from processed HTML so it's only in accordion
  const contentHtml = faqHtml
    ? processedHtml.replace(faqHtml, "")
    : processedHtml;

  return (
    <div className="content-main max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
      {/* Table of Contents */}
      <div className="lg:w-64 w-full flex justify-center lg:block mb-6 lg:mb-0">
        <TableOfContents
          tocItems={tocItems}
          scrollToSection={scrollToSection}
        />
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* Main Article */}
        <div className="prose max-w-none">{parse(contentHtml)}</div>

        {/* FAQ Accordion */}
        <div className="faq-section mt-8" id="heading-faq">
          <FAQAccordion faqHtml={faqHtml} />
        </div>
      </div>
    </div>
  );
};

export default ArticleContentRenderer;
