import { useState, useEffect } from 'react';

export const useContent = () => {
    const [qaData, setQaData] = useState([]);
    const [sectionContents, setSectionContents] = useState({});
    const [openSection, setOpenSection] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadContent = async (index) => {
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
            loadContent(openSection);
        }
    }, [openSection, qaData]);

    return {
        qaData,
        sectionContents,
        openSection,
        loading,
        handleSectionToggle: setOpenSection
    };
};