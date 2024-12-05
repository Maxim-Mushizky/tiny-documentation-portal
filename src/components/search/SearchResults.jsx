import { Search } from 'lucide-react';

export const SearchResults = ({ results, isSearching, onResultClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {isSearching ? (
                <div className="p-4 text-gray-500 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-2"></div>
                    <span>Searching...</span>
                </div>
            ) : results.length > 0 ? (
                <ul className="max-h-[480px] overflow-y-auto divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                    {results.map((result) => (
                        <li key={result.index} className="border-b border-gray-100 last:border-0">
                            <button
                                onClick={() => onResultClick(result.index)}
                                className="w-full text-left p-4 hover:bg-blue-50 transition-colors duration-200 flex flex-col gap-1"
                            >
                                <div className="font-medium text-gray-900">
                                    {result.title}
                                </div>
                                {result.matches.content && (
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <Search className="h-4 w-4 mr-1.5 text-gray-400" />
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
                <div className="p-6 text-gray-500 text-center bg-gray-50">
                    <p className="font-medium">No results found</p>
                    <p className="text-sm mt-1 text-gray-400">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
};