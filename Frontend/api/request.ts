import axios from "../utils/axios"; 

type Method = "get" | "post" | "put" | "delete";

export const request = async <T = any>(
    method: Method,
    url: string,
    payload?: any
): Promise<T> => { 
    try {
        const config: { method: Method; url: string; data?: any; params?: any } = {
            method,
            url,
        };

        if (method === "get") {
            config.params = payload;
        } else {
            config.data = payload;
        }

        const response = await axios(config);
        return response.data;
    } catch (error: any) {
       
        console.error("API Request Error:", error.response?.data?.message || error.message || "خطای نامشخص");
      
        return Promise.reject(error); 
    }
};