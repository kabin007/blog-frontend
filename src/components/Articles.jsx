import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Eye,
  User,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Articles = ({ onArticleClick }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/v1/articles/");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.results || data);
        setFilteredArticles(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search and category
  useEffect(() => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.short_description_display
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category?.slug === selectedCategory,
      );
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, articles]);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique categories for filter
  const categories = [
    ...new Set(articles.map((article) => article.category).filter(Boolean)),
  ];

  // Handle article click
  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            BrahmaBlog
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Discover insights, stories, and knowledge from our community of
            writers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            {filteredArticles.length} article
            {filteredArticles.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Knowledge shared</span>
          </div>
        </div>

        {/* Articles Grid/List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-8"
            }
          >
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className={`group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Article Image */}
                <div
                  className={`${
                    viewMode === "grid" ? "h-56" : "flex-shrink-0 w-64 h-full"
                  } overflow-hidden relative`}
                >
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt || article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div
                  className={`${viewMode === "grid" ? "p-6" : "p-6 flex-1"}`}
                >
                  {/* Title */}
                  <h2
                    className={`font-serif font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-3 ml-1${
                      viewMode === "grid" ? "text-xl" : "text-2xl"
                    } leading-tight`}
                  >
                    {article.title}
                  </h2>

                  {/* Short Description */}
                  <p
                    className={`text-gray-600 mb-4 ${
                      viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"
                    } font-light`}
                  >
                    {article.short_description_display}
                  </p>

                  {/* Meta Information */}
                  <div
                    className={`flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5 ${
                      viewMode === "list" ? "mt-4" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>
                        {article.author?.full_name || article.author?.username}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(article.publish_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{article.reading_time} min read</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-4"></div>

                  {/* Footer Stats */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{article.view_count} views</span>
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <span className="text-sm">Read article</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
