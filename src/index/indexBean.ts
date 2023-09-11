import StringUtil from "../common/stringUtil.js";
import { Charsets, CountFunc, CountFuncUtf8, CountUp, Custom1, HTMLFormElement_Null, HtmlElement_Null, IsHankaku, Length, NewLine, Sjis, Space, Utf8 } from "../type/typer.js";

export default class IndexBean {

    /**
     * インスタンスを返却します。
     * @returns IndexBeanのインスタンス
     */
    static createInstance(): IndexBean {
        return new IndexBean();
    }

    /**
     * カウント方法を指定するリテラル型を全て返却します。
     * @returns リテラル型を格納した配列
     */
    static getCharTypes(): [Utf8, Sjis, Length, Space, NewLine, Custom1] {
        return ["utf8", "sjis", "length", " ", "\n", "custom1"];
    }

    /**
     * 変換した文字列を表示させます。
     * @returns
     */
    dispConvertedString(): void {
        const convertedStr: string = this.convertString();
        const textElement: HtmlElement_Null = document.getElementById("convertionDispArea");
        if (!textElement) {
            console.error("id:convertionDispAreaが存在しません");
            return;
        }
        textElement.innerText = convertedStr;
    }

    /**
     * 入力した文字列を変換します。
     * @returns 
     */
    convertString(): string {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const formElement: HTMLFormElement_Null = (document.getElementById("stringForm") as HTMLFormElement | null);
        const str: string = this.existsConvertionElement(textElement, formElement);
        if (str === "") {
            return "";
        }
        const convertionType = formElement!.convert_type.value;
        if (convertionType === "upper") {
            return StringUtil.toUpperCase(str);
        } else if (convertionType === "lower") {
            return StringUtil.toLowerCase(str);
        }
        return str;
    }

    /**
     * 変換する文字列の要素が存在するか判定します。
     * @param textElement 
     * @param formElement 
     * @returns true:存在, false:存在しない
     */
    existsConvertionElement(textElement: HtmlElement_Null, formElement: HTMLFormElement_Null): string {
        if (!textElement) {
            console.error("id:inputTextAreaが存在しません");
            return "";
        }
        const str: string | null = (textElement as HTMLTextAreaElement).value;
        if (!str) {
            console.log("文字列が入力されていないため早期終了します。");
            return "";
        }
        if (!formElement) {
            console.error("id:stringFormが存在しません。");
            return "";
        }
        return str;
    }

    /**
     * カウント数を画面に表示させます。
     * @param charset キャラセットによって文字列のカウント方法を動的に変更
     * @param elementId カウント数を表示させる要素ID
     * @param count カウント方法
     * @returns 
     */
    dispStringContents(charset: Charsets, elementId: string, count: CountUp | null): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById(elementId);
        // 入力エリア存在チェック
        if (!this.existsDsipElement(textElement, stringLengthArea, elementId)) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(this.controlCountFunc(charset, str, count));
    }

    /**
     * 入力エリア、表示エリアが存在するか判定します。
     * @param textElement 入力エリアの要素
     * @param stringDispArea 出力エリアの要素
     * @param elementId 出力エリア要素のID
     * @returns true:存在する, false:存在しない
     */
    existsDsipElement(textElement: HtmlElement_Null, stringDispArea: HtmlElement_Null, elementId: string): boolean {
        if (textElement === null) {
            console.error("id:inputTextAreaが存在しません。");
            return false;
        }
        if (stringDispArea === null) {
            console.error(`id:${elementId}が存在しません。`);
            return false;
        }
        return true;
    }

    /**
     * キャラセットによってカウント方法のメソッドを切替えます。
     * @param charset キャラセット
     * @param inputedWord 入力ワード
     * @param countUp カウントアップ種別
     * @returns カウント数
     */
    controlCountFunc(charset: Charsets, inputedWord: string, countUp: CountUp | null): number {
        if (charset === "sjis") {
            return this.countByCountType(inputedWord, countUp!);
        } else if (charset === "utf8") {
            return this.countByteOfUtf8(inputedWord);
        } else if (charset === "length") {
            return inputedWord.length;
        } else if (charset === " " || charset === "\n") {
            return this.countTargetWord(inputedWord, charset);
        } else if (charset === "custom1") {
            const customElement = (document.getElementById("countForm") as HTMLFormElement_Null);
            return this.countCustomWord(customElement, inputedWord);
        }
        return 0;
    }

    /**
    * カウント数(半角, 全角, SJIS(バイト))を取得します。
    * @param str 
    * @param countUp 
    * @returns 
    */
    countByCountType(str: string, countUp: CountUp): number {
        let length: number = 0;
        const isHankaku: IsHankaku = (c: number) => (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        for (let i = 0; i < str.length; i++) {
            let c: number = str.charCodeAt(i);
            length = countUp(c, length, isHankaku);
        }
        return length;
    }

    /**
     * UTF-8のバイト数を取得します。
     * @param str 
     * @returns UTF-8のバイト
     */
    countByteOfUtf8(str: string): number {
        return new Blob([str], { type: 'text/plain' }).size;
    }

    /**
     * 文字列に含まれている対象の文字列のカウント数を取得します。
     * @param str 
     * @param target 
     * @returns 
     */
    countTargetWord(str: string, target: string): number {
        return [...str].filter(c => c === target).length;
    }

    /**
     * 文字列に含まれている対象の文字列のカウント数を取得します。
     * @param str 全体の文字列
     * @param target 検索の文字列
     * @returns カウント数
     */
    countIncludingTargetWord(str: string, target: string): number {
        const regExp: RegExp = new RegExp(target, "g");
        return (str.match(regExp) || []).length;
    }

    /**
     * カスタマイズカウント要素が存在するか判定します。
     * @param customElement 
     * @returns 
     */
    checkCustomWord(customElement: HTMLFormElement_Null): boolean {
        if (!customElement) {
            console.error(`id:countFormが存在しません。`);
            return false;
        }
        const customSearchWord = customElement!.custom1.value;
        // カスタム文字列が入力されてない場合はカウントしない
        if (!customSearchWord) {
            return false;
        }
        return true;
    }
    /**
     * カスタムカウント文字列のカウント数を返却します。
     * @param inputedWord 入力された文字列
     * @returns カスタムカウント文字列のカウント数
     */
    countCustomWord(customElement: HTMLFormElement_Null, inputedWord: string): number {
        if (!this.checkCustomWord(customElement)) {
            return 0;
        }
        const customSearchWord = customElement!.custom1.value;
        return this.countIncludingTargetWord(inputedWord, customSearchWord);
    }

    /**
     * 半角か判定します。
     * @param c
     * @returns true:半角, false:半角以外
     */
    isHankaku(c: number): boolean {
        return (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
    }

    /**
     * 半角の文字をカウントアップします。
     * @param c 
     * @param length 
     * @param isHankaku 
     * @returns 
     */
    countUpHankakuChar(c: number, length: number, isHankaku: IsHankaku): number {
        if (isHankaku(c)) {
            length += 1;
        }
        return length;
    }

    /**
     * 全角の文字をカウントアップします。
     * @param c 
     * @param length 
     * @param isHankaku 
     * @returns 
     */
    countUpZenkakuChar(c: number, length: number, isHankaku: IsHankaku): number {
        if (!isHankaku(c)) {
            length += 1;
        }
        return length;
    }

    /**
     * SJISのバイト数をカウントアップします。
     * @param c 
     * @param length 
     * @param isHankaku 
     * @returns 
     */
    countUpSjis(c: number, length: number, isHankaku: IsHankaku): number {
        if (isHankaku(c)) {
            length += 1;
        } else {
            length += 2;
        }
        return length;
    }

}