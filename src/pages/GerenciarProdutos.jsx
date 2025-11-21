import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function GerenciarProdutos() {
    //Estados básicos
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        linkDownload: '',
        imagemUrl: '',
        googleDriveFileId: '',
        categoriaId: '',
    });

    useEffect(() => {
        carregarDados();
    }, []);

    //Função carregarDados
    const carregarDados = async () => {
        //Futura implementação da chamada API
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-10 py-10 max-w-7xl">

                {/*Título*/}
                <h1 className="text-3xl font-bold text-helou-green mb-8">
                    Gerenciar Produtos
                </h1>

                {/*Botão Adicionar*/}
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-helou-green text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all mb-8 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar novo produto
                </button>

                {/*Div cinza vazia*/}
                <div className="bg-gray-300 rounded-lg p-8 min-h-[200px]">
                     {/*Conteúdo da lista*/}
                </div>

            </main>
        </div>
    );
}