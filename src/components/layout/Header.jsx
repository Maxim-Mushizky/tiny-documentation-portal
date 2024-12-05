import { Logo } from '../ui/Logo';
import { SearchBar } from '../search/SearchBar';

export const Header = (searchProps) => {
    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-gray-200 fixed top-0 w-full z-10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between relative"> {/* Added relative */}
                    <div className="flex items-center space-x-4 pl-0">
                        <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                            <Logo />
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
                    <div className="w-96"> {/* Added container for search */}
                        <SearchBar {...searchProps} />
                    </div>
                </div>
            </div>
        </header>
    );
};