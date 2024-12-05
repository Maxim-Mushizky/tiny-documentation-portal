// QAWebsite.jsx
import { useState, useEffect } from "react";
import { Layout } from "./layout/Layout";
import { useSearch } from "./hooks/useSearch";  // Changed from ../hooks to ./hooks
import { useContent } from "./hooks/useContent"; // Changed from ../hooks to ./hooks

const QAWebsite = () => {
    const {
        searchQuery,
        searchMode,
        searchResults,
        isSearching,
        handleSearch,
        handleSearchModeChange
    } = useSearch();

    const {
        qaData,
        sectionContents,
        openSection,
        loading,
        handleSectionToggle,
        loadContent
    } = useContent();

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
        <Layout
            searchProps={{
                searchQuery,
                searchMode,
                searchResults,
                isSearching,
                onSearch: handleSearch,
                onSearchModeChange: handleSearchModeChange
            }}
            sidebarProps={{
                qaData,
                openSection,
                onSectionToggle: handleSectionToggle
            }}
            contentProps={{
                qaData,
                openSection,
                sectionContents
            }}
        />
    );
};

export default QAWebsite;