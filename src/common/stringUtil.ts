export default class StringUtil {

    /**
     * 文字列を大文字に変換します。
     * @param {string} str 文字列
     * @returns 大文字に変換した文字列
     */
    static toUpperCase(str: string): string {
        return str.toUpperCase();
    }

    /**
     * 文字列を小文字に変換します。
     * @param {string} str 文字列
     * @returns 小文字に変換した文字列
     */
    static toLowerCase(str: string): string {
        return str.toLowerCase();
    }

}