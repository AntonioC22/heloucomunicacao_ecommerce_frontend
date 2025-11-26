import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const produtosApi = {
    listar: () => api.get('/produtos'),
    buscarPorId: (id) => api.get(`/produtos/${id}`),
    criar: (produto) => api.post('/produtos', produto),
    atualizar: (id, produto) => api.put(`/produtos/${id}`, produto),
    atualizarStatus: (id, status) => api.put(`/produtos/${id}/status?novoStatus=${status}`),
};

export default api;