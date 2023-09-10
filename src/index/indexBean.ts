import StringUtil from "../common/stringUtil.js";
import { HTMLFormElement_Null, HtmlElement_Null } from "../type/typer.js";

export default class IndexBean {

    static createInstance(): IndexBean {
        return new IndexBean();
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

    dispStringLength(): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById("stringLengthArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, ()=>console.error("id:stringLengthAreaが存在しません。"))) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(str.length);
    }

    dispStringByte(): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById("stringByteArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, ()=>console.error("id:stringByteAreaが存在しません。"))) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(this.changeStringToByte(str));
    }

    changeStringToByte(str: string): number {
        return new Blob([str], {type: 'text/plain'}).size;
    }

    dispStringSjis(): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById("stringSjisArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, ()=>console.error("id:stringByteAreaが存在しません。"))) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(this.changeStringToSjisByte(str, this.countUpSjis));
    }

    dispStringZenkaku(): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById("stringZenkakuArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, ()=>console.error("id:stringZenkakuAreaが存在しません。"))) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(this.changeStringToSjisByte(str, this.countUpZenkakuChar));
    }

    dispStringHankaku(): void {
        const textElement: HtmlElement_Null = document.getElementById("inputTextArea");
        const stringLengthArea: HtmlElement_Null = document.getElementById("stringHankakuArea");
        if (!this.existsDsipElement(textElement, stringLengthArea, ()=>console.error("id:stringHankakuAreaが存在しません。"))) {
            return;
        }
        const str: string = (textElement as HTMLTextAreaElement).value;
        stringLengthArea!.textContent = String(this.changeStringToSjisByte(str, this.countUpHankakuChar));
    }

    changeStringToSjisByte(str: string, countUp:(c: number, length: number, isHankaku: (c: number)=>boolean)=>number): number {
        let length: number = 0;
        const isHankaku: (c: number)=>boolean = c => (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4);
        for (let i = 0; i < str.length; i++) {
          let c: number = str.charCodeAt(i);
          length = countUp(c, length, isHankaku);
        }
        return length;
    }

    countUpHankakuChar(c: number, length:number, isHankaku: (c: number)=>boolean): number {
        if (isHankaku(c)) {
            length += 1;
        }
        return length;
    }

    countUpZenkakuChar(c: number, length:number, isHankaku: (c: number)=>boolean): number {
        if (!isHankaku(c)) {
            length += 1;
        }
        return length;
    }

    countUpSjis(c: number, length:number, isHankaku: (c: number)=>boolean): number {
        if (isHankaku(c)) {
            length += 1;
          } else {
            length += 2;
        }
        return length;
    }

    existsDsipElement(textElement: HtmlElement_Null, stringDispArea: HtmlElement_Null, errorLog:()=>void): boolean {
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