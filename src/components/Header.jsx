import { Link } from 'react-router-dom';
import { User, ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Helou Logo"
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-xl font-bold text-gray-900">Helou</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                            <User className="w-6 h-6 text-helou-green" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                            <ShoppingCart className="w-6 h-6 text-helou-green" />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}