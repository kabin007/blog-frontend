import React, { useState, useEffect } from "react";
import {
  Calendar,
  Folder,
  Clock,
  ArrowLeft,
  Menu,
  X,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
} from "lucide-react";

const ArticleDetail = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [expandedQA, setExpandedQA] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/v1/articles/${articleId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  useEffect(() => {
    if (!article) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll("[id]");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const extractTableOfContents = (content) => {
    if (!content) return [];

    const tocRegex =
      /<div[^>]*name="tableOfContents"[^>]*><a href="#([^"]+)">([^<]+)<\/a><\/div>/g;
    const toc = [];
    let match;

    while ((match = tocRegex.exec(content)) !== null) {
      toc.push({
        id: match[1],
        title: match[2],
      });
    }

    return toc;
  };

  const toggleQA = (index) => {
    setExpandedQA(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const processContent = (content) => {
    if (!content) return "";

    let processedContent = content
      // Style code blocks with enhanced design
      .replace(
        /<pre[^>]*>/g,
        '<pre class="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100 p-6 rounded-2xl overflow-x-auto my-8 text-sm shadow-2xl border border-gray-700">',
      )
      .replace(
        /<code[^>]*>/g,
        '<code class="bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 rounded-lg text-sm font-mono text-indigo-800 border border-indigo-200">',
      )
      // Enhanced headings with gradient effects
      .replace(
        /<h3([^>]*)>/g,
        '<h3$1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-16 mb-8 pb-3 border-b-2 border-gradient-to-r from-indigo-200 to-purple-200">',
      )
      .replace(
        /<h2([^>]*)>/g,
        '<h2$1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-20 mb-10 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 relative"><span class="absolute -left-4 top-1 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>',
      )
      // Enhanced paragraphs
      .replace(
        /<p([^>]*)class="pw-post-body-paragraph[^"]*"([^>]*)>/g,
        '<p class="text-gray-700 leading-8 mb-8 text-lg font-light">',
      )
      // Enhanced links with hover effects
      .replace(
        /<a([^>]*)>/g,
        '<a$1 class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4 hover:decoration-blue-800 transition-all duration-300 font-medium">',
      )
      // Enhanced strong/bold text
      .replace(/<strong[^>]*>/g, '<strong class="font-bold text-gray-900 bg-gradient-to-r from-yellow-100 to-orange-100 px-1 rounded">')
      .replace(/<b[^>]*>/g, '<strong class="font-bold text-gray-900 bg-gradient-to-r from-yellow-100 to-orange-100 px-1 rounded">')
      // Enhanced em/italic text
      .replace(/<em[^>]*>/g, '<em class="italic text-gray-800 font-medium">')
      // Enhanced hr
      .replace(/<hr[^>]*>/g, '<hr class="my-12 border-0 h-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent rounded-full">')
      // Remove TOC elements from main content
      .replace(/<div[^>]*name="tableOfContents"[^>]*>.*?<\/div>/g, "")
      .replace(/<p[^>]*name="tableOfContents"[^>]*>.*?<\/p>/g, "");

    return processedContent;
  };

  const extractQASection = (content) => {
    if (!content) return [];

    // Look for Q&A patterns in the content
    const qaRegex = /<p[^>]*>.*?<strong[^>]*>\s*Q:\s*(.*?)<\/strong>.*?<\/p>\s*<p[^>]*>(.*?)<\/p>/gi;
    const qaPairs = [];
    let match;

    while ((match = qaRegex.exec(content)) !== null) {
      qaPairs.push({
        question: match[1].trim(),
        answer: match[2].trim().replace(/<[^>]*>/g, ''), // Strip HTML tags from answer
      });
    }

    // Alternative pattern for different Q&A formats
    if (qaPairs.length === 0) {
      const altQARegex = /<h3[^>]*>.*?Q:\s*(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi;
      while ((match = altQARegex.exec(content)) !== null) {
        qaPairs.push({
          question: match[1].trim(),
          answer: match[2].trim().replace(/<[^>]*>/g, ''),
        });
      }
    }

    return qaPairs;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTocOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-red-100">
          <div className="text-red-500 text-2xl mb-6 font-bold">
            Oops! Something went wrong
          </div>
          <div className="text-gray-600 mb-8">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100">
          <div className="text-gray-600 mb-8 text-xl">Article not found</div>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const tableOfContents = extractTableOfContents(article.content);
  const qaPairs = extractQASection(article.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced floating gradient elements */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 opacity-30 blur-3xl animate-pulse"></div>
      <div className="fixed top-1/4 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-25 blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed bottom-10 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 blur-3xl animate-pulse delay-2000"></div>
      
      {/* Main Content - Centered */}
      <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10 flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Header Section - Centered */}
          <div className="mb-16 text-center">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {article.category && (
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <Folder className="w-4 h-4 mr-2" />
                  {article.category.name}
                </span>
              )}
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                <Clock className="w-4 h-4 mr-2" />
                {article.reading_time} min read
              </span>
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.publish_date)}
              </span>
              {article.view_count && (
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <Eye className="w-4 h-4 mr-2" />
                  {article.view_count} views
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-8 tracking-tight">
              {article.title}
            </h1>
            
            {/* Decorative line */}
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
          </div>

          {/* Featured Image - Centered */}
          {article.featured_image && (
            <div className="mb-16 flex justify-center">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-4xl">
                <img
                  src={article.featured_image}
                  alt={article.featured_image_alt || "Featured"}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          )}

          {/* Short Description - Centered */}
          {article.short_description && (
            <div className="mb-16 flex justify-center">
              <div className="max-w-4xl w-full">
                <p className="text-2xl text-gray-700 leading-relaxed font-light text-center bg-gradient-to-r from-white to-indigo-50 p-10 rounded-3xl shadow-xl border border-indigo-100 relative overflow-hidden">
                  <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></span>
                  {article.short_description}
                </p>
              </div>
            </div>
          )}

          {/* Table of Contents - Mobile Toggle */}
          {tableOfContents.length > 0 && (
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="fixed top-6 right-6 z-50 lg:hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
            >
              {tocOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Table of Contents - Centered */}
          {tableOfContents.length > 0 && (
            <div className="mb-16 flex justify-center">
              <div className="w-full max-w-4xl bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-xl border border-indigo-100 p-8 relative overflow-hidden">
                <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></span>
                <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Table of Contents
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <nav>
                  <ul className="space-y-3">
                    {tableOfContents.map((item, index) => (
                      <li key={index} className="flex justify-center">
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`block px-6 py-4 rounded-2xl transition-all duration-300 w-full max-w-2xl text-center relative overflow-hidden group ${
                            activeSection === item.id
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl transform scale-105"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 hover:shadow-lg hover:transform hover:scale-102"
                          }`}
                        >
                          <span className="relative z-10 font-medium">{item.title}</span>
                          {activeSection === item.id && (
                            <span className="absolute left-0 top-0 w-2 h-full bg-yellow-400 rounded-r-full"></span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Article Content - Centered */}
          <div className="flex justify-center mb-16">
            <div className="w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 lg:p-12 relative overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></span>
              <div
                className="article-content prose prose-xl max-w-none text-center"
                dangerouslySetInnerHTML={{
                  __html: processContent(article.content),
                }}
              />
            </div>
          </div>

          {/* Q&A Section */}
          {qaPairs.length > 0 && (
            <div className="mb-16 flex justify-center">
              <div className="w-full max-w-4xl bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl border border-indigo-200 p-8 relative overflow-hidden">
                <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></span>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Frequently Asked Questions
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  {qaPairs.map((qa, index) => (
                    <div
                      key={index}
                      className="border border-indigo-200 rounded-2xl overflow-hidden bg-gradient-to-r from-white to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleQA(index)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-indigo-700 transition-colors duration-300">
                          {qa.question}
                        </span>
                        <span className="flex-shrink-0 text-indigo-600 group-hover:text-purple-600 transition-all duration-300 transform group-hover:scale-110">
                          {expandedQA[index] ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </span>
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          expandedQA[index] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 pt-2 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-indigo-100">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="mt-20 pt-12 border-t-2 border-gradient-to-r from-transparent via-indigo-300 to-transparent">
                {/* Author Info */}
                {article.author && (
                  <div className="flex items-center justify-center gap-6 text-gray-600 mb-10">
                    <div className="text-center bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-100">
                      <div className="font-bold text-xl text-gray-900 mb-2">
                        {article.author.full_name || article.author.username}
                      </div>
                      <div className="text-sm text-indigo-600 font-medium">Author</div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-lg"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    Back to all articles
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC Overlay */}
      {tocOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-white to-indigo-50 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Contents</h3>
              <button
                onClick={() => setTocOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav>
              <ul className="space-y-3">
                {tableOfContents.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;