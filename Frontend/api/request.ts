import axios from "../utils/axios";

type Method = "get" | "post" | "put" | "delete";

export const request = async <T = any>(
    method: Method,
    url: string,
    data? : any
): Promise<T | null> =>{
    try{
        const response = await axios({
            method,
            url,
            data,
        });
        return response.data;
    } catch(error : any){
        console.log(error.response?.data?.message || "خطای نامشخص");
         return null;
    }
};