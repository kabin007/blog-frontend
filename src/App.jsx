import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import "./App.css";
import ArticleDetail from "./components/ArticleDetail";
import Articles from "./components/Articles";

// Wrapper component to extract articleId from URL params
function ArticleDetailWrapper() {
  const { id } = useParams();
  return <ArticleDetail articleId={id} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/article/:id" element={<ArticleDetailWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
