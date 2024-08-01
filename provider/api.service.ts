import axios from "axios";

import { AuthStore } from "./context";
import { ExtendedResponse, ApiGetProps, ApiPostProps } from "@/types";

class API {
  public async get<T>({
    endpoint,
    query,
  }: ApiGetProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = AuthStore.getState();

    const request = await axios.get(
      // `https://velayo-eservice.vercel.app/api${endpoint}`,
      `http://localhost:3000/api${endpoint}`,
      {
        params: query,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
        meta: request.data.meta,
      };
    else
      return {
        success: false,
        code: 500,
        message: "There is an error in the Server.",
      };
  }

  public async post<T>({
    endpoint,
    payload,
  }: ApiPostProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = AuthStore.getState();

    const request = await axios.post(
      // `https://velayo-eservice.vercel.app/api${endpoint}`,
      `http://localhost:3000/api${endpoint}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
      };
    else
      return {
        ...request.data,
        success: false,
      };
  }
}

export default API;
