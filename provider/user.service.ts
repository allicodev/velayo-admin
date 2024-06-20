import Api from "./api.service";
import {
  UserLoginProps,
  ExtendedResponse,
  UserWithToken,
  PageProps,
  Response,
  User,
} from "@/types";

class UserService {
  private readonly instance = new Api();

  public async login(
    payload: UserLoginProps
  ): Promise<ExtendedResponse<UserWithToken>> {
    return await this.instance.post<UserWithToken>({
      endpoint: "/auth/login",
      payload,
      publicRoute: true,
    });
  }

  public async newUser(payload: User): Promise<ExtendedResponse<User>> {
    const response = await this.instance.post<User>({
      endpoint: "/user/new-user",
      payload,
    });
    return response;
  }

  // ! fix update user
  public async updateUser(payload: User): Promise<ExtendedResponse<User>> {
    const response = await this.instance.post<User>({
      endpoint: "/user/update-user",
      payload,
    });
    return response;
  }

  public async getUsers(prop: PageProps): Promise<ExtendedResponse<User[]>> {
    let role: any = prop.role;
    if (prop.role) role = JSON.stringify(prop.role);
    const response = await this.instance.get<User[]>({
      endpoint: "/user/get-users",
      query: { ...prop, role },
    });
    return response;
  }

  public async deleteUser({ id }: { id: string }): Promise<Response> {
    const response = await this.instance.get<Response>({
      endpoint: "/user/remove-user",
      query: {
        id,
      },
    });
    return response;
  }
}

export default UserService;
