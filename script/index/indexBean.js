import StringUtil from "../common/stringUtil.js";
export default class IndexBean {
    /**
     * インスタンスを返却します。
     * @returns IndexBeanのインスタンス
     */
    static createInstance() {
        return new IndexBean();
    }
    /**
     * カウント方法を指定するリテラル型を全て返却します。
     * @returns リテラル型を格納した配列
     */
    static getCharTypes() {
        return ["utf8", "sjis", "length", " ", "\n", "custom1"];
    }
    /**
     * 変換した文字列を表示させます。
     * @returns
     */
    dispConvertedString() {
        const convertedStr = this.convertString();
        const textElement = document.getElementById("convertionDispArea");
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
    convertString() {
        const textElement = document.getElementById("inputTextArea");
        const formElement = document.getElementById("stringForm");
        const str = this.existsConvertionElement(textElement, formElement);
        if (str === "") {
            return "";
        }
        const convertionType = formElement.convert_type.value;
        if (convertionType === "upper") {
            return StringUtil.toUpperCase(str);
        }
        else if (convertionType === "lower") {
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
    existsConvertionElement(textElement, formElement) {
        if (!textElement) {
            console.error("id:inputTextAreaが存在しません");
            return "";
        }
        const str = textElement.value;
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
    dispStringContents(charset, elementId, count) {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById(elementId);
        // 入力エリア存在チェック
        if (!this.existsDsipElement(textElement, stringLengthArea, elementId)) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(this.controlCountFunc(charset, str, count));
    }
    /**
     * 入力エリア、表示エリアが存在するか判定します。
     * @param textElement 入力エリアの要素
     * @param stringDispArea 出力エリアの要素
     * @param elementId 出力エリア要素のID
     * @returns true:存在する, false:存在しない
     */
    existsDsipElement(textElement, stringDispArea, elementId) {
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
    controlCountFunc(charset, inputedWord, countUp) {
        if (charset === "sjis") {
            return this.countByCountType(inputedWord, countUp);
        }
        else if (charset === "utf8") {
            return this.countByteOfUtf8(inputedWord);
        }
        else if (charset === "length") {
            return inputedWord.length;
        }
        else if (charset === " " || charset === "\n") {
            return this.countTargetWord(inputedWord, charset);
        }
        else if (charset === "custom1") {
            const customElement = document.getElementById("countForm");
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
    countByCountType(str, countUp) {
        let length = 0;
        const isHankaku = (c) => (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            length = countUp(c, length, isHankaku);
        }
        return length;
    }
    /**
     * UTF-8のバイト数を取得します。
     * @param str
     * @returns UTF-8のバイト
     */
    countByteOfUtf8(str) {
        return new Blob([str], { type: 'text/plain' }).size;
    }
    /**
     * 文字列に含まれている対象の文字列のカウント数を取得します。
     * @param str
     * @param target
     * @returns
     */
    countTargetWord(str, target) {
        return [...str].filter(c => c === target).length;
    }
    /**
     * 文字列に含まれている対象の文字列のカウント数を取得します。
     * @param str 全体の文字列
     * @param target 検索の文字列
     * @returns カウント数
     */
    countIncludingTargetWord(str, target) {
        const regExp = new RegExp(target, "g");
        return (str.match(regExp) || []).length;
    }
    /**
     * カスタマイズカウント要素が存在するか判定します。
     * @param customElement
     * @returns
     */
    checkCustomWord(customElement) {
        if (!customElement) {
            console.error(`id:countFormが存在しません。`);
            return false;
        }
        const customSearchWord = customElement.custom1.value;
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
    countCustomWord(customElement, inputedWord) {
        if (!this.checkCustomWord(customElement)) {
            return 0;
        }
        const customSearchWord = customElement.custom1.value;
        return this.countIncludingTargetWord(inputedWord, customSearchWord);
    }
    /**
     * 半角か判定します。
     * @param c
     * @returns true:半角, false:半角以外
     */
    isHankaku(c) {
        return (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
    }
    /**
     * 半角の文字をカウントアップします。
     * @param c
     * @param length
     * @param isHankaku
     * @returns
     */
    countUpHankakuChar(c, length, isHankaku) {
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
    countUpZenkakuChar(c, length, isHankaku) {
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
    countUpSjis(c, length, isHankaku) {
        if (isHankaku(c)) {
            length += 1;
        }
        else {
            length += 2;
        }
        return length;
    }
}
