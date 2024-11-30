import API from "./api.service";
import {
  UserLoginProps,
  ExtendedResponse,
  UserWithToken,
  PageProps,
  Response,
  User,
} from "@/types";

abstract class UserService {
  public static async login(
    payload: UserLoginProps
  ): Promise<ExtendedResponse<UserWithToken>> {
    return await API.post<UserWithToken>({
      endpoint: "/auth/login",
      payload,
      publicRoute: true,
    });
  }

  public static async newUser(payload: User): Promise<ExtendedResponse<User>> {
    const response = await API.post<User>({
      endpoint: "/user/new-user",
      payload,
    });
    return response;
  }

  // ! fix update user
  public static async updateUser(
    payload: User
  ): Promise<ExtendedResponse<User>> {
    const response = await API.post<User>({
      endpoint: "/user/update-user",
      payload,
    });
    return response;
  }

  public static async getUsers(
    prop: PageProps
  ): Promise<ExtendedResponse<User[]>> {
    let role: any = prop.role;
    if (prop.role) role = JSON.stringify(prop.role);
    const response = await API.get<User[]>({
      endpoint: "/user/get-users",
      query: { ...prop, role },
    });
    return response;
  }

  public static async deleteUser({ id }: { id: string }): Promise<Response> {
    const response = await API.get<Response>({
      endpoint: "/user/remove-user",
      query: {
        id,
      },
    });
    return response;
  }
}

export default UserService;
