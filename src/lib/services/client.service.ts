import api from '../api-client';
import { Client } from '@/types';
import { mapClient } from '../mappers';

export const ClientService = {
    async getAll(): Promise<Client[]> {
        const response = await api.get('/clients');
        return response.data.map(mapClient);
    },

    async getById(id: string): Promise<Client> {
        const response = await api.get(`/clients/${id}`);
        return mapClient(response.data);
    },

    async create(client: Partial<Client>): Promise<Client> {
        const response = await api.post('/clients', client);
        return mapClient(response.data);
    },

    async update(id: string, client: Partial<Client>): Promise<Client> {
        const response = await api.put(`/clients/${id}`, client);
        return mapClient(response.data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/clients/${id}`);
    }
};
