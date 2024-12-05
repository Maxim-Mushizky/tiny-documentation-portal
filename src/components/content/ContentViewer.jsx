import { Card } from '../ui/Card';
import { MarkdownRenderer } from './MarkdownRenderer';

export const ContentViewer = ({ qaData, openSection, sectionContents }) => {
    return (
        <div className="ml-64 flex-1 p-6">
            {qaData.map((section, index) => (
                <div key={index} className={openSection === index ? 'block' : 'hidden'}>
                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {section.title}
                            </h2>
                            <MarkdownRenderer content={sectionContents[index]} />
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};