import { Demo } from "@/types";
import API from "../util/apiClient";

export const getAllWeddingContent = async (): Promise<any> => 
    API.get("/wedding");
  
export const getWeddingByCategory = async (category: string): Promise<any> => 
    API.get(`/wedding/${category}`);

export const launchWedding = async (id?: string): Promise<any> => 
    API.post(`/wedding/launch/${id}`);

export const updateWedding = async (id: string, data: Demo.wedding): Promise<any> => 
    API.patch(`/wedding/${id}`, data);

export const createWedding = async (data: Demo.wedding): Promise<any> => 
    API.post("/wedding", data);

export const deleteWedding = async (id?: string): Promise<any> => 
    API.delete(`/wedding/${id}`);
