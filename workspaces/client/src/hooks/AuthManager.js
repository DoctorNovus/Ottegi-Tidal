export class AuthManager {
    // User token
    static token = "";

    /**
     * Returns the headers via set token
     * @returns 
     */
    static getHeaders() {
        return {
            "Authorization": `${AuthManager.token}`
        };
    }
}