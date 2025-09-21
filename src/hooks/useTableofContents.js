import { useState, useEffect } from "react";

export const useTableOfContents = (html) => {
  const [tocItems, setTocItems] = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");

  useEffect(() => {
    if (!html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const items = [];
    let updatedHtml = html;

    // Regular headings (h2, h3)
    const headings = doc.querySelectorAll("h2, h3");
    headings.forEach((heading, index) => {
      const text = heading.textContent.trim();
      const level = parseInt(heading.tagName.charAt(1));

      // Only skip if it's FAQ; we will handle FAQ separately
      if (text.toUpperCase() === "FAQ") return;

      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      items.push({ id, text, level });

      const headingWithId = heading.outerHTML.replace(
        `<${heading.tagName.toLowerCase()}`,
        `<${heading.tagName.toLowerCase()} id="${id}"`,
      );
      updatedHtml = updatedHtml.replace(heading.outerHTML, headingWithId);
    });

    // Add FAQ as a single TOC item if it exists
    const h2Elements = Array.from(doc.querySelectorAll("h2"));
    const faqHeading = h2Elements.find(
      (h2) => h2.textContent.trim().toUpperCase() === "FAQ",
    );

    if (faqHeading) {
      const faqId = `heading-faq`;
      items.push({ id: faqId, text: "FAQ", level: 2 }); // single TOC item for FAQ
      const faqWithId = faqHeading.outerHTML.replace(
        "<h2",
        `<h2 id="${faqId}"`,
      );
      updatedHtml = updatedHtml.replace(faqHeading.outerHTML, faqWithId);
    }

    setTocItems(items);
    setProcessedHtml(updatedHtml);
  }, [html]);

  return { tocItems, processedHtml };
};
