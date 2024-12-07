import React from 'react';
import { Search, X } from 'lucide-react';
import { SearchResults } from './SearchResults';

export const SearchBar = ({
    searchQuery,
    searchMode,
    searchResults,
    isSearching,
    onSearch,
    onSearchModeChange
}) => {
    return (
        <div className="relative">
            <div className="flex items-center">
                <select
                    value={searchMode}
                    onChange={onSearchModeChange}
                    className="absolute top-0 right-full mr-2 h-10 px-3 py-2 bg-blue-600 text-white
                    rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="fuzzy">Fuzzy Search</option>
                    <option value="regex">Regular Expression</option>
                </select>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="h-10 w-64 pl-10 pr-10 rounded-lg bg-blue-800/50 border border-blue-700
                        text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search documentation..."
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearch('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-5 w-5 text-blue-200 hover:text-white" />
                        </button>
                    )}
                </div>
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <SearchResults
                        results={searchResults}
                        isSearching={isSearching}
                        onResultClick={(index) => {
                            onSearch('');
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;