import API from "../util/apiClient";

// Tipe untuk data yang dikirim ke endpoint register dan login
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword : string;
  }

interface ResetPasswordData {
  verificationCode: string;
  password: string;
}

export const test = async (): Promise<any> => 
  API.get("/");

export const signUp = async (data: SignUpCredentials): Promise<any> => 
  API.post("/auth/register", data);

export const login = async (data: LoginCredentials): Promise<any> => 
  API.post("/auth/login", data);

export const logout = async (): Promise<any> => 
  API.get("/auth/logout");

export const verifyEmail = async (verificationCode: string): Promise<any> => 
  API.get(`/auth/email/verify/${verificationCode}`);

export const sendPasswordResetEmail = async (email: string): Promise<any> => 
  API.post("/auth/password/forgot", { email });

export const resetPassword = async (data: ResetPasswordData): Promise<any> => 
  API.post("/auth/password/reset", data);

export const getUser = async (): Promise<any> => 
  API.get("/user");

export const getSessions = async (): Promise<any> => 
  API.get("/sessions");

export const deleteSession = async (id: string): Promise<any> => 
  API.delete(`/sessions/${id}`);
