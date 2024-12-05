export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
            {children}
        </div>
    );
};