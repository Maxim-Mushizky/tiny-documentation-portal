import React from 'react';
import { Search } from 'lucide-react';

export const SearchResults = ({ results, isSearching, onResultClick }) => {
    return (
        <div className="w-full">
            {isSearching ? (
                <div className="p-4 text-gray-500 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-2"></div>
                    <span>Searching...</span>
                </div>
            ) : results.length > 0 ? (
                <ul className="max-h-[480px] overflow-y-auto divide-y divide-gray-100">
                    {results.map((result) => (
                        <li key={result.index} className="border-b border-gray-100 last:border-0">
                            <button
                                onClick={() => onResultClick(result.index)}
                                className="w-full text-left p-4 hover:bg-blue-50 transition-colors"
                            >
                                <div className="font-medium text-gray-900">
                                    {result.title}
                                </div>
                                {result.matches.content && (
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <Search className="h-4 w-4 mr-1.5" />
                                        <span>Matches in content</span>
                                    </div>
                                )}
                                {result.score !== undefined && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Match score: {(1 - result.score).toFixed(2)}
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-4 text-gray-500 text-center">
                    No results found
                </div>
            )}
        </div>
    );
};

export default SearchResults;