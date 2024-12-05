// components/layout/Header.jsx
import React, { useState } from 'react';
import { Logo } from '../ui/Logo';
import { SearchBar } from '../search/SearchBar';
import { CreateQA } from '../content/CreateQA';

export const Header = (searchProps) => {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-gray-200 fixed top-0 w-full z-10 shadow-lg">
            <div className="h-20 px-6 flex items-center justify-between">
                {/* Left - Logo and Title */}
                <div className="flex items-center">
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

                {/* Right - Search and Button */}
                <div className="flex items-center gap-4">
                    <SearchBar {...searchProps} />
                    <button
                        onClick={() => setShowCreate(true)}
                        className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-md 
                        hover:bg-blue-700 transition-colors"
                    >
                        Create New Q&A
                    </button>
                </div>
            </div>

            {showCreate && <CreateQA onClose={() => setShowCreate(false)} />}
        </header>
    );
};

export default Header;