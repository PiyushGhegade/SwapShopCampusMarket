import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = ['Books', 'Electronics', 'Furniture', 'Others'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    onSearch?.(term);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      </form>

      {showSuggestions && (
        <div className="absolute w-full mt-2 bg-black rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-500 mb-2">Categories</div>
            {categories.map((category) => (
              <div
                key={category}
                className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => {
                  navigate(`/category/${category.toLowerCase()}`);
                  setShowSuggestions(false);
                }}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;