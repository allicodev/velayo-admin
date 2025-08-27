export default abstract class ApiConfig {
  public static getBaseUrl(isProd: boolean): string {
    return isProd
      ? "https://velayo-eservice-ten.vercel.app/api"
      : "http://localhost:3000/api";
  }
}
