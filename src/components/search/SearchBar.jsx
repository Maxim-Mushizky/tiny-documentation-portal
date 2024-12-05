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
        <div className="relative w-96 pb-20"> {/* Added pb-20 to create padding space for dropdown */}
            <div className="flex items-center space-x-2 mb-2">
                <select
                    value={searchMode}
                    onChange={onSearchModeChange}
                    className="w-full px-4 py-2 bg-blue-800/50 border border-blue-700 rounded-lg text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                    <option value="fuzzy">Fuzzy Search</option>
                    <option value="regex">Regular Expression</option>
                </select>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-200" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-blue-700 rounded-lg 
                    bg-blue-800/50 placeholder-blue-300 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={searchMode === 'regex' ? 'Search using regex...' : 'Search documentation...'}
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
            {searchQuery && (
                <div className="absolute top-full right-0 w-full bg-white rounded-lg shadow-xl 
                    border border-gray-200 max-h-[480px] overflow-y-auto z-50 mt-2">
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