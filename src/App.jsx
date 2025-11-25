import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import GerenciarProdutos from './pages/GerenciarProdutos';


export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                    <Route path="/" element={<Navigate to="/produtos" replace />} />
                    <Route path="/produtos" element={<GerenciarProdutos />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
