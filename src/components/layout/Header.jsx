// components/layout/Header.jsx
// components/layout/Header.jsx
import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { SearchBar } from '../search/SearchBar';
import { CreateQA } from '../content/CreateQA';

export const Header = (searchProps) => {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-gray-200 fixed top-0 w-full z-10 shadow-lg">
            <div className="px-6 h-20">
                <div className="flex items-center justify-between h-full">
                    {/* Logo and title section */}
                    <div className="flex items-center flex-shrink-0">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Logo />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-white">
                                Documentation Portal
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Knowledge Base & User Guides
                            </p>
                        </div>
                    </div>

                    {/* Search and Create button section */}
                    <div className="flex items-center space-x-4">
                        <SearchBar {...searchProps} />
                        <button
                            onClick={() => setShowCreate(true)}
                            className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            transition-colors border border-blue-500 focus:outline-none focus:ring-2 
                            focus:ring-blue-500"
                        >
                            Create New Q&A
                        </button>
                    </div>
                </div>
            </div>

            {showCreate && <CreateQA onClose={() => setShowCreate(false)} />}
        </header>
    );
};

export default Header;