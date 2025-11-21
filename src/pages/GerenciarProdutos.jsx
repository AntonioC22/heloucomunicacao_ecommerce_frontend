import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { produtosApi, categoriasApi } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function GerenciarProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    // ====== NOVO ESTADO: IMAGE PREVIEW ======
    const [imagePreview, setImagePreview] = useState('');

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

    const carregarDados = async () => {
        setLoading(true);
        const loadingToast = toast.loading('Carregando produtos...');
        try {
            const [produtosRes, categoriasRes] = await Promise.all([
                produtosApi.listar(),
                categoriasApi.listarAtivas(),
            ]);
            setProdutos(produtosRes.data);
            setCategorias(categoriasRes.data);
            toast.success('Produtos carregados!', { id: loadingToast });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados!', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const abrirModalAdicionar = () => {
        setModoEdicao(false);
        setProdutoSelecionado(null);
        setFormData({
            nome: '',
            descricao: '',
            preco: '',
            linkDownload: '',
            imagemUrl: '',
            googleDriveFileId: '',
            categoriaId: '',
        });
        // ====== LIMPAR PREVIEW ======
        setImagePreview('');
        setModalOpen(true);
    };

    const abrirModalEditar = async (id) => {
        try {
            const response = await produtosApi.buscarPorId(id);
            const produto = response.data;
            setModoEdicao(true);
            setProdutoSelecionado(produto);
            setFormData({
                nome: produto.nome,
                descricao: produto.descricao || '',
                preco: produto.preco,
                linkDownload: produto.linkDownload || '',
                imagemUrl: produto.imagemUrl || '',
                googleDriveFileId: produto.googleDriveFileId || '',
                categoriaId: produto.categoria?.id?.toString() || '',
            });
            // ====== SETAR PREVIEW COM IMAGEM EXISTENTE ======
            setImagePreview(produto.imagemUrl || '');
            setModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            toast.error('Erro ao carregar produto!');
        }
    };

    // ====== ATUALIZAR HANDLE INPUT CHANGE PARA PREVIEW ======
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Se for o campo de URL da imagem, atualizar preview
        if (name === 'imagemUrl') {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const produtoData = {
            nome: formData.nome,
            descricao: formData.descricao,
            preco: parseFloat(formData.preco),
            linkDownload: formData.linkDownload,
            imagemUrl: formData.imagemUrl || null,
            googleDriveFileId: formData.googleDriveFileId || null,
            categoria: {
                id: parseInt(formData.categoriaId),
            },
        };

        const loadingToast = toast.loading(
            modoEdicao ? 'Atualizando produto...' : 'Criando produto...'
        );

        try {
            if (modoEdicao && produtoSelecionado) {
                await produtosApi.atualizar(produtoSelecionado.id, produtoData);
                toast.success('Produto atualizado com sucesso!', { id: loadingToast });
            } else {
                await produtosApi.criar(produtoData);
                toast.success('Produto criado com sucesso!', { id: loadingToast });
            }
            setModalOpen(false);
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            toast.error('Erro ao salvar produto!', { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Toaster />
            <main className="container mx-auto px-10 py-10 max-w-7xl">
                <h1 className="text-3xl font-bold text-helou-green mb-8">
                    Gerenciar Produtos
                </h1>

                <button
                    onClick={abrirModalAdicionar}
                    className="bg-helou-green text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all mb-8"
                >
                    + Adicionar novo produto
                </button>

                <div className="bg-gray-300 rounded-lg p-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-5">
                        Lista de Produtos Cadastrados ({produtos.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Carregando produtos...
                        </div>
                    ) : produtos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum produto cadastrado.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table
                                className="w-full border-separate"
                                style={{ borderSpacing: '0 8px' }}
                            >
                                <thead>
                                <tr className="bg-gray-300">
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Nome
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Preço
                                    </th>
                                    <th className="text-center px-3 py-3 text-sm font-semibold text-gray-700">
                                        Link
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Categoria
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-center px-3 py-3 text-sm font-semibold text-gray-700">
                                        Editar
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {produtos.map((produto) => (
                                    <tr
                                        key={produto.id}
                                        className="bg-white border border-gray-300"
                                    >
                                        <td className="px-3 py-4 text-sm text-gray-800 rounded-l-lg">
                                            {produto.nome}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800">
                                            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <Download className="w-5 h-5 mx-auto text-gray-600 cursor-pointer hover:text-helou-green" />
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800">
                                            {produto.categoria?.nome || 'Sem categoria'}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-800">
                                            {produto.status}
                                        </td>
                                        <td className="px-3 py-4 text-center rounded-r-lg">
                                            <button
                                                onClick={() => abrirModalEditar(produto.id)}
                                                className="text-lg cursor-pointer hover:scale-110 transition-transform"
                                            >
                                                ✏️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-helou-green">
                                {modoEdicao ? 'Editar Produto' : 'Adicionar Novo Produto'}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-3xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="nome">Nome do Produto *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="categoriaId">Categoria *</Label>
                                <Select
                                    value={formData.categoriaId}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, categoriaId: value }))
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="descricao">Descrição</Label>
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-y"
                                />
                            </div>

                            <div>
                                <Label htmlFor="preco">Preço (R$) *</Label>
                                <Input
                                    id="preco"
                                    name="preco"
                                    type="number"
                                    step="0.01"
                                    value={formData.preco}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="imagemUrl">URL da Imagem</Label>
                                <Input
                                    id="imagemUrl"
                                    name="imagemUrl"
                                    type="url"
                                    value={formData.imagemUrl}
                                    onChange={handleInputChange}
                                />
                                {/* ====== PREVIEW DA IMAGEM ====== */}
                                {imagePreview && (
                                    <div className="mt-3 text-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-full max-h-48 rounded border border-gray-300 mx-auto"
                                            onError={() => toast.error('Erro ao carregar imagem!')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="googleDriveFileId">Google Drive File ID *</Label>
                                <Input
                                    id="googleDriveFileId"
                                    name="googleDriveFileId"
                                    value={formData.googleDriveFileId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="linkDownload">Link de Download</Label>
                                <Input
                                    id="linkDownload"
                                    name="linkDownload"
                                    type="url"
                                    value={formData.linkDownload}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-md font-medium hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-helou-green text-white px-5 py-2.5 rounded-md font-medium hover:opacity-90"
                                >
                                    {modoEdicao ? 'Atualizar' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}