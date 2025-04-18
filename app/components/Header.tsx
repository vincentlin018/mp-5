// Header component for the top section of the URL shortener app
export default function Header() {
    return (
        // Render a header with flex layout, spacing, and vertical centering
        <header className="flex justify-between items-center h-20">
            {/* App title, styled as a large, bold heading with padding */}
            <h2 className="text-5xl font-semibold p-4">URL Shortener</h2>
        </header>
    );
}
