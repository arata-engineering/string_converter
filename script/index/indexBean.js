import StringUtil from "../common/stringUtil.js";
export default class IndexBean {
    constructor() {
        this.self = this;
    }
    static createInstance() {
        return new IndexBean();
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
    dispStringLength() {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById("stringLengthArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, () => console.error("id:stringLengthAreaが存在しません。"))) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(str.length);
    }
    dispStringByte() {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById("stringByteArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, () => console.error("id:stringByteAreaが存在しません。"))) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(this.changeStringToByte(str));
    }
    changeStringToByte(str) {
        return new Blob([str], { type: 'text/plain' }).size;
    }
    dispStringSjis() {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById("stringSjisArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, () => console.error("id:stringByteAreaが存在しません。"))) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(this.changeStringToSjisByte(str, this.countUpSjis));
    }
    dispStringZenkaku() {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById("stringZenkakuArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, () => console.error("id:stringZenkakuAreaが存在しません。"))) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(this.changeStringToSjisByte(str, this.countUpZenkakuChar));
    }
    dispStringHankaku() {
        const textElement = document.getElementById("inputTextArea");
        const stringLengthArea = document.getElementById("stringHankakuArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, () => console.error("id:stringHankakuAreaが存在しません。"))) {
            return;
        }
        const str = textElement.value;
        stringLengthArea.textContent = String(this.changeStringToSjisByte(str, this.countUpHankakuChar));
    }
    changeStringToSjisByte(str, countUp) {
        let length = 0;
        const isHankaku = c => (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            length = countUp(c, length, isHankaku);
        }
        return length;
    }
    countUpHankakuChar(c, length, isHankaku) {
        if (isHankaku(c)) {
            length += 1;
        }
        return length;
    }
    countUpZenkakuChar(c, length, isHankaku) {
        if (!isHankaku(c)) {
            length += 1;
        }
        return length;
    }
    countUpSjis(c, length, isHankaku) {
        if (isHankaku(c)) {
            length += 1;
        }
        else {
            length += 2;
        }
        return length;
    }
    existsDsipElement(textElement, stringDispArea, errorLog) {
        if (textElement === null) {
            console.error("id:inputTextAreaが存在しません。");
            return false;
        }
        if (stringDispArea === null) {
            errorLog();
            return false;
        }
        return true;
    }
}
