import { api } from "@/lib/api";
import { CreateShiftRequest, Shift, UpdateShiftRequest } from "@/types/shift";

class ShiftService {
    private endpoint = '/shifts';

    async getAll(): Promise<Shift[]> {
        // The API might return PaginatedResponse<Shift> or Shift[] directly.
        // Given the dummy data provided by the user is an array, I'll assume it returns an array.
        // However, standard project pattern for list endpoints is PaginatedResponse.
        // I'll check if the response has 'data' property.
        const { data } = await api.get<any>(this.endpoint);
        if (data && Array.isArray(data.data)) {
            return data.data;
        }
        return Array.isArray(data) ? data : [];
    }

    async getById(id: number): Promise<Shift> {
        const { data } = await api.get<Shift>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(shift: CreateShiftRequest): Promise<Shift> {
        const { data } = await api.post<Shift>(this.endpoint, shift);
        return data;
    }

    async update(id: number, shift: UpdateShiftRequest): Promise<Shift> {
        const { data } = await api.put<Shift>(`${this.endpoint}/${id}`, shift);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const shiftService = new ShiftService();
