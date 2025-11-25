import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const produtosApi = {
    listarProdutos: () => api.get('/produtos'),
    buscarPorId: (id) => api.get(`/produtos/${id}`),
    criar: (produto) => api.post('/produtos', produto),
    atualizar: (id, produto) => api.put(`/produtos/${id}`, produto),
    atualizarStatus: (id, status) => api.put(`/produtos/${id}/status?novoStatus=${status}`),
};

export const categoriasApi = {
    listarAtivas: () => api.get('/categorias'), // O erro aconteceu porque essa linha não existia ou não estava exportada
    // listarTodas: () => api.get('/categorias')
};

export default api;