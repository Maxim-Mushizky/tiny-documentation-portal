import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';


const QAWebsite = () => {
    const [openSection, setOpenSection] = useState(null);
    const [sectionContents, setSectionContents] = useState({});
    const [qaData, setQaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/config');
                if (!response.ok) throw new Error('Failed to load config');
                const data = await response.json();
                setQaData(data.sections);
            } catch (error) {
                console.error('Error loading config:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const performSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Search failed');
                const results = await response.json();
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            performSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, performSearch]);

    useEffect(() => {
        const loadFileContent = async (index) => {
            const section = qaData[index];
            if (section?.contentType === "file" && !sectionContents[index]) {
                try {
                    const response = await fetch(section.path);
                    if (!response.ok) throw new Error('Failed to load content');
                    const content = await response.text();
                    setSectionContents(prev => ({
                        ...prev,
                        [index]: content
                    }));
                } catch (error) {
                    console.error('Error loading file:', error);
                    setSectionContents(prev => ({
                        ...prev,
                        [index]: "Error loading content. Please check the file path."
                    }));
                }
            }
        };

        if (openSection !== null) {
            loadFileContent(openSection);
        }
    }, [openSection, qaData]);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
        setSearchQuery('');
    };

    const components = {
        img: ({ node, ...props }) => {
            const imgSrc = props.src.startsWith('http')
                ? props.src
                : `http://localhost:3001${props.src}`;

            return (
                <img
                    {...props}
                    src={imgSrc}
                    className="max-w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                    alt={props.alt || ''}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                />
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-lg text-gray-600">
                    Loading documentation...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-gray-200 fixed top-0 w-full z-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <svg
                                    className="w-8 h-8 text-blue-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Documentation Portal
                                </h1>
                                <p className="text-blue-100 text-sm">
                                    Knowledge Base & User Guides
                                </p>
                            </div>
                        </div>

                        <div className="relative w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 border border-blue-800 rounded-lg leading-5 bg-blue-800/50 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                                placeholder="Search documentation..."
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X className="h-5 w-5 text-blue-200 hover:text-white" />
                                </button>
                            )}

                            {searchQuery && (
                                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                    {isSearching ? (
                                        <div className="p-4 text-gray-500 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-2"></div>
                                            Searching...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <ul className="max-h-96 overflow-auto divide-y divide-gray-100">
                                            {searchResults.map((result) => (
                                                <li key={result.index}>
                                                    <button
                                                        onClick={() => {
                                                            setOpenSection(result.index);
                                                            setSearchQuery('');
                                                        }}
                                                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="font-medium text-gray-900">
                                                            {result.title}
                                                        </div>
                                                        {result.matches.content && (
                                                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                                <Search className="h-4 w-4 mr-1" />
                                                                Matches in content
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
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex min-h-screen pt-20">
                <div className="w-64 fixed h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contents</h2>
                    <nav className="space-y-1">
                        {qaData.map((section, index) => (
                            <button
                                key={index}
                                onClick={() => toggleSection(index)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${openSection === index
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="ml-64 flex-1 p-6">
                    {qaData.map((section, index) => (
                        <div key={index} className={openSection === index ? 'block' : 'hidden'}>
                            <Card className="bg-white shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        {section.title}
                                    </h2>
                                    <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-500">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                                            components={components}
                                        >
                                            {sectionContents[index] || 'Loading...'}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QAWebsite;