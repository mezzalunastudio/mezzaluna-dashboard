import API from "../util/apiClient";

export const getMenu = async (): Promise<any> => 
    API.get("/dashboard/menu/role");
  
  