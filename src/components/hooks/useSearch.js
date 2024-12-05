import { useState, useCallback } from 'react';

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState('fuzzy');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(
        async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            try {
                setIsSearching(true);
                const response = await fetch(
                    `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&mode=${searchMode}`
                );
                if (!response.ok) throw new Error('Search failed');
                const results = await response.json();
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [searchMode]
    );

    return {
        searchQuery,
        searchMode,
        searchResults,
        isSearching,
        handleSearch: setSearchQuery,
        handleSearchModeChange: (e) => setSearchMode(e.target.value)
    };
};