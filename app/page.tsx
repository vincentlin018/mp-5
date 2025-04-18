// Import the main UI components for the Home page
import Header from "./components/Header";
import Title from "./components/Title";
import ShortenForm from "./components/ShortenForm";

// Home page component that renders the app header, title, and the URL shortening form
export default function Home() {
    return (
        <>
            {/* App header at the top */}
            <Header />
            {/* Main page title */}
            <Title />
            {/* URL shortener form */}
            <ShortenForm />
        </>
    );
}

