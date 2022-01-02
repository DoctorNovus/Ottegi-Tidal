import path from "path";

/**
 * Basic shared utility class
 */
export class Utils {
    /**
     * Gets the path in relation to the workspace directory
     * @param {string} localPath path starting at the workspaces directory
     * @returns path from workspaces directory
     */
    static GetLocalPath(localPath) {
        return path.resolve(`${process.cwd()}../../${localPath}/`);
    }

    /**
     * Returns a number-based ID with x length
     * @param {number} length length of the ID
     * @returns x length ID
     */
    static createID(length) {
        let id = "";

        let entries = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i <= length; i++) {
            id += entries[Math.floor(Math.random() * entries.length)];
        }

        return id;
    }

    /**
     * Returns a number and string-based token with x length
     * @param {number} length length of the token
     * @returns x length token
     */
    static createToken(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}