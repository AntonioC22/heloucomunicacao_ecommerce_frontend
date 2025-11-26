import { useState, useEffect } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { flushSync } from 'react-dom';

const CATEGORIA_URL = 'http://localhost:8080/categorias';

export default function GerenciarCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [categoriasOriginais, setCategoriasOriginais] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [alteracoesPendentes, setAlteracoesPendentes] = useState(new Map());

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
    });

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        setLoading(true);
        const loadingToast = toast.loading('Carregando categorias...');
        try {
            const response = await axios.get(CATEGORIA_URL);
            setCategorias(response.data);
            setCategoriasOriginais(JSON.parse(JSON.stringify(response.data)));
            toast.success('Categorias carregadas!', { id: loadingToast });
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            toast.error('Erro ao carregar dados!', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const abrirModalAdicionar = () => {
        setModoEdicao(false);
        setCategoriaSelecionada(null);
        setFormData({ nome: '', descricao: '' });
        setModalOpen(true);
    };

    const abrirModalEditar = async (id) => {
        try {
            const response = await axios.get(`${CATEGORIA_URL}/${id}`);
            const categoria = response.data;
            setModoEdicao(true);
            setCategoriaSelecionada(categoria);
            setFormData({
                nome: categoria.nome,
                descricao: categoria.descricao || '',
            });
            setModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            toast.error('Erro ao carregar categoria!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoriaData = {
            nome: formData.nome,
            descricao: formData.descricao,
        };

        const loadingToast = toast.loading(
            modoEdicao ? 'Atualizando categoria...' : 'Criando categoria...'
        );

        try {
            if (modoEdicao && categoriaSelecionada) {
                await axios.put(`${CATEGORIA_URL}/${categoriaSelecionada.id}`, categoriaData);
                toast.success('Categoria atualizada com sucesso!', { id: loadingToast });
            } else {
                await axios.post(CATEGORIA_URL, categoriaData);
                toast.success('Categoria criada com sucesso!', { id: loadingToast });
            }
            setModalOpen(false);
            carregarCategorias();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            toast.error('Erro ao salvar categoria!', { id: loadingToast });
        }
    };

    const alterarStatus = (categoriaId, novoStatus) => {
        const novasCategorias = categorias.map((c) =>
            c.id === categoriaId ? { ...c, status: novoStatus } : c
        );
        setCategorias(novasCategorias);

        const categoriaOriginal = categoriasOriginais.find((c) => c.id === categoriaId);
        const novasAlteracoes = new Map(alteracoesPendentes);

        if (categoriaOriginal.status !== novoStatus) {
            novasAlteracoes.set(categoriaId, novoStatus);
        } else {
            novasAlteracoes.delete(categoriaId);
        }

        setAlteracoesPendentes(novasAlteracoes);
    };

    // const salvarAlteracoes = async () => {
    //     if (alteracoesPendentes.size === 0) return;
    //
    //     const loadingToast = toast.loading('Salvando alterações...');
    //
    //     try {
    //         const promises = Array.from(alteracoesPendentes.entries()).map(([id, status]) =>
    //             axios.put(`${CATEGORIA_URL}/${id}/status?novoStatus=${status}`)
    //         );
    //
    //         await Promise.all(promises);
    //         toast.success('Alterações salvas com sucesso!', { id: loadingToast });
    //         setAlteracoesPendentes(new Map());
    //         carregarCategorias();
    //     } catch (error) {
    //         console.error('Erro ao salvar alterações:', error);
    //         toast.error('Erro ao salvar alterações!', { id: loadingToast });
    //     }
    // };

    // const cancelarAlteracoes = () => {
    //     if (confirm('Deseja cancelar todas as alterações pendentes?')) {
    //         setCategorias(JSON.parse(JSON.stringify(categoriasOriginais)));
    //         setAlteracoesPendentes(new Map());
    //         toast.success('Alterações canceladas!');
    //     }
    // };

    const handleCancelarModal = () => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-medium">Deseja cancelar?</p>
                <p className="text-sm text-gray-600">As alterações não serão salvas.</p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300"
                    >
                        Não
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);

                            // FECHAR PRIMEIRO, MOSTRAR TOAST DEPOIS
                            flushSync(() => {
                                setModalOpen(false);
                            });

                            toast.success('Cancelado!');
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
                    >
                        Sim, cancelar
                    </button>
                </div>
            </div>
        ));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const categoriaFoiModificada = (id) => alteracoesPendentes.has(id);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            <main className="container mx-auto px-10 py-10 max-w-7xl">
                <h1 className="text-3xl font-bold text-helou-green mb-8">Gerenciar Categorias</h1>

                <button
                    onClick={abrirModalAdicionar}
                    className="bg-helou-green text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all mb-8"
                >
                    + Adicionar nova categoria
                </button>

                <div className="bg-gray-300 rounded-lg p-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-5">
                        Lista de Categorias Cadastradas ({categorias.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Carregando categorias...</div>
                    ) : categorias.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhuma categoria cadastrada.
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
                                        Descrição
                                    </th>
                                    <th className="text-left px-3 py-3 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-center px-3 py-3 text-sm font-semibold text-gray-700">
                                        Ações
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {categorias.map((categoria) => (
                                    <tr
                                        key={categoria.id}
                                        className={`bg-white rounded-lg transition-colors ${
                                            categoriaFoiModificada(categoria.id)
                                                ? 'bg-yellow-50 border-2 border-orange-400'
                                                : 'border border-gray-300'
                                        }`}
                                    >
                                        <td className="px-3 py-4 text-sm font-medium text-gray-800 rounded-l-lg">
                                            {categoria.nome}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-600">
                                            {categoria.descricao || '-'}
                                        </td>
                                        <td className="px-3 py-4">
                                            <select
                                                value={categoria.status}
                                                onChange={(e) => alterarStatus(categoria.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded border text-sm font-medium cursor-pointer appearance-none bg-white pr-8 bg-no-repeat bg-right ${
                                                    categoria.status === 'Ativo'
                                                        ? 'text-green-700 border-green-700'
                                                        : 'text-red-700 border-red-700'
                                                }`}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                                    backgroundPosition: 'right 8px center',
                                                }}
                                            >
                                                <option value="Ativo">Ativo</option>
                                                <option value="Inativo">Inativo</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-4 text-center rounded-r-lg">
                                            <button
                                                onClick={() => abrirModalEditar(categoria.id)}
                                                className="cursor-pointer hover:scale-110 transition-transform inline-flex items-center justify-center"
                                            >
                                                <SquarePen className="w-5 h-5 text-gray-600" />
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

            {/* Botões Fixos */}
            {/*<div className="fixed bottom-5 right-10 flex gap-4 z-50">*/}
            {/*    /!*<button*!/*/}
            {/*    /!*    onClick={salvarAlteracoes}*!/*/}
            {/*    /!*    disabled={alteracoesPendentes.size === 0}*!/*/}
            {/*    /!*    className={`px-8 py-3.5 rounded-md font-semibold text-base transition-all shadow-lg ${*!/*/}
            {/*    /!*        alteracoesPendentes.size > 0*!/*/}
            {/*    /!*            ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600 hover:-translate-y-0.5'*!/*/}
            {/*    /!*            : 'bg-gray-400 text-white cursor-not-allowed'*!/*/}
            {/*    /!*    }`}*!/*/}
            {/*    /!*>*!/*/}
            {/*    /!*    Salvar*!/*/}
            {/*    /!*</button>*!/*/}
            {/*    {alteracoesPendentes.size > 0 && (*/}
            {/*        <button*/}
            {/*            onClick={cancelarAlteracoes}*/}
            {/*            className="bg-red-500 text-white px-8 py-3.5 rounded-md font-semibold hover:bg-red-600 hover:-translate-y-0.5 transition-all shadow-lg"*/}
            {/*        >*/}
            {/*            Cancelar*/}
            {/*        </button>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    {/* TOASTER ESPECÍFICO DO MODAL */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <Toaster
                            containerStyle={{
                                position: 'absolute',
                                inset: 0,
                            }}
                            position="top-center"
                            reverseOrder={false}
                        />
                    </div>

                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-helou-green">
                                {modoEdicao ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                            </h2>
                            {/*<button*/}
                            {/*    onClick={handleCancelarModal}*/}
                            {/*    className="text-gray-400 hover:text-gray-600 text-3xl"*/}
                            {/*>*/}
                            {/*    ×*/}
                            {/*</button>*/}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nome">Nome da Categoria *</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="descricao">Descrição</Label>
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-y"
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancelarModal}
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