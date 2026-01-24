import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="flex justify-center bg-accent h-16 py-2 px-4">
            <div className="flex flex-1 items-center justify-start gap-4">
                <Link to="/" className="cursor-pointer text-on-accent hover:opacity-80 transition-opacity">Explore</Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <span className="text-on-accent font-bold text-xl">fl/AI\ght</span>
            </div>
            <div className="flex flex-1 items-center justify-end gap-3">
                <Link to="/login" className="bg-secondary text-primary hover:opacity-80 px-5 py-1.5 rounded-full transition-opacity cursor-pointer">Log in</Link>
                <Link to="/register" className="bg-primary text-primary border border-themed hover:opacity-80 px-5 py-1.5 rounded-full transition-opacity cursor-pointer">Register</Link>
            </div>
        </nav>
    );
}
