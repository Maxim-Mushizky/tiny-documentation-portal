export const Sidebar = ({ qaData, openSection, onSectionToggle }) => {
    return (
        <div className="w-64 fixed h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contents</h2>
            <nav className="space-y-1">
                {qaData.map((section, index) => (
                    <button
                        key={index}
                        onClick={() => onSectionToggle(index)}
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
    );
};