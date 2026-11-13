import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

// 1. Project Card Component
const ProjectCard = ({ snippet }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col h-[320px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 relative bg-gray-900 overflow-hidden border-b border-gray-700 group">
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-4xl">⚡</span>
          </div>
        )}
        {isHovered && (
          <div className="w-full h-full relative">
             <iframe
                title={snippet.title}
                sandbox="allow-scripts"
                className="w-[200%] h-[200%] border-none origin-top-left scale-50 pointer-events-none"
                srcDoc={`
                  <html>
                    <style>body { margin: 0; overflow: hidden; } ${snippet.files?.find(f => f.name.endsWith('.css'))?.value || ''}</style>
                    <body>${snippet.files?.find(f => f.name.endsWith('.html'))?.value || ''}</body>
                    <script>${snippet.files?.find(f => f.name.endsWith('.js'))?.value || ''}</script>
                  </html>
                `}
              />
              <div className="absolute inset-0 z-10"></div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 truncate">{snippet.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
             <span>@{snippet.owner?.username || "Dev"}</span>
             <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Link to={`/snippet/${snippet._id}`} className="mt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            View Project
          </button>
        </Link>
      </div>
    </div>
  );
};

// 2. Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// 3. Main Component (Using Native IntersectionObserver)
const Discover = () => {
  const [snippets, setSnippets] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // This ref is attached to the "Loading..." div at the bottom
  const loaderRef = useRef(null);

  const fetchSnippets = async (pageNum) => {
    if (loading) return; // Prevent double fetching
    setLoading(true);
    
    try {
      const res = await api.get(`/snippets/explore?page=${pageNum}&limit=6`);
      
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setSnippets((prev) => {
          // Prevent adding duplicates based on ID
          const existingIds = new Set(prev.map(p => p._id));
          const newItems = res.data.filter(p => !existingIds.has(p._id));
          return [...prev, ...newItems];
        });
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSnippets(1);
  }, []);

  // Infinite Scroll Observer Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSnippets(nextPage);
      }
    }, {
      root: null, // use the viewport
      rootMargin: '20px', // trigger 20px before element is visible
      threshold: 1.0
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, page]); // Re-run effect when state changes to update closure

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Community Creations
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {snippets.map((snippet) => (
            <ProjectCard key={snippet._id} snippet={snippet} />
          ))}
        </div>

        {/* --- Infinite Scroll Trigger --- */}
        {hasMore && (
          <div ref={loaderRef} className="mt-10">
             <LoadingSpinner />
          </div>
        )}
        
        {!hasMore && snippets.length > 0 && (
          <div className="text-center mt-10 text-gray-500 pb-10">
            You've reached the end! 🚀
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;