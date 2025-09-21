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
  User,
  MessageCircle,
  Tag,
} from "lucide-react";
import ArticleContentRenderer from "./ArticleContentRenderer";
import "./article.css";

const ArticleDetail = ({ articleId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [expandedQA, setExpandedQA] = useState({});
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/v1/articles/${articleId}`,
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

  // Format date helper - moved outside useEffect
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create article content with proper styling for TinyMCE HTML
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no article data
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">No article found</p>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8">
          {/* Featured Badge */}
          {/* {article.is_featured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                ✨ Featured Article
              </span>
            </div>
          )}*/}
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            {article.title}
          </h1>
          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {article.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {article.category.name}
              </span>
            )}
            {article.tags &&
              article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
          </div>
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-15  text-sm text-gray-500 mb-6 mx-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {article.author?.full_name || article.author?.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publish_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.reading_time} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.view_count} views</span>
            </div>
            {article.allow_comments && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </div>
            )}
          </div>
          {/* Short Description */}
          <p className="text-xl text-gray-600 mb-6 py-3 leading-relaxed">
            {article.short_description}
          </p>
        </header>
        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="article-renderer">
          <ArticleContentRenderer html={article.content} />
        </div>
        {/* Article Footer */}
        <footer className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-7">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className=" text-gray-600">
                Published on {formatDate(article.publish_date)}
              </p>
              <p className=" text-gray-500">
                Last updated: {formatDate(article.updated_at)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {article.status}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default ArticleDetail;
