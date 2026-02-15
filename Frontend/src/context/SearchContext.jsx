import { useState, useEffect } from "react";
import { SearchContext } from "./SearchContextDef";

export function SearchProvider({ children }) {
  // Initialize state from sessionStorage if available
  const [query, setQuery] = useState(() => {
    const saved = sessionStorage.getItem("searchQuery");
    return saved || "";
  });
  
  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem("searchResults");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasSearched, setHasSearched] = useState(() => {
    return sessionStorage.getItem("hasSearched") === "true";
  });

  // Persist query to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("searchQuery", query);
  }, [query]);

  // Persist results to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem("searchResults", JSON.stringify(results));
  }, [results]);

  // Persist hasSearched flag
  useEffect(() => {
    sessionStorage.setItem("hasSearched", hasSearched.toString());
  }, [hasSearched]);

  // Function to clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    sessionStorage.removeItem("searchQuery");
    sessionStorage.removeItem("searchResults");
    sessionStorage.removeItem("hasSearched");
  };

  return (
    <SearchContext.Provider
      value={{ 
        query, 
        setQuery, 
        results, 
        setResults, 
        hasSearched, 
        setHasSearched,
        clearSearch 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
