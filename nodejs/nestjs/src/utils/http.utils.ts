export default class HttpUtils {

    static parseToken(req: any): string | null {
        try {
            const bearerToken = req.headers.authorization;
            const bearer = "Bearer ";
            if(!bearerToken || !bearerToken.startsWith(bearer)) {
                return null;
            }
            const token = bearerToken.replace(bearer, '');
            return token;
        }
        catch(e) {
            console.log(e);
            return null;
        }
    }
}