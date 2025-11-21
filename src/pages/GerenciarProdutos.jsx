import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
        setLoading(true);
        try {
            const response = await produtosApi.listar();
            setProdutos(response.data);
            toast.success('Produtos carregados com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            toast.error('Erro ao carregar a lista de produtos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
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

                {/*Container da Tabela*/}
                <div className="bg-gray-300 rounded-lg p-8 min-h-[200px]">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Carregando produtos...</div>
                    ) : produtos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum produto encontrado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate" style={{ borderSpacing: '0 8px' }}>
                                <thead>
                                <tr className="bg-gray-300">
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Nome
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Preço
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Categoria
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {produtos.map((produto) => (
                                    <tr
                                        key={produto.id}
                                        className="bg-white rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 py-4 text-sm text-gray-800 rounded-l-lg">
                                            {produto.nome}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800">
                                            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800">
                                            {produto.categoria?.nome || '-'}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800 rounded-r-lg">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    produto.status === 'Ativo'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {produto.status || 'Indefinido'}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}