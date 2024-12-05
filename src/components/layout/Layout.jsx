import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ContentViewer } from '../content/ContentViewer';

export const Layout = ({ searchProps, sidebarProps, contentProps }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header {...searchProps} />
            <div className="flex min-h-screen pt-20">
                <Sidebar {...sidebarProps} />
                <ContentViewer {...contentProps} />
            </div>
        </div>
    );
};