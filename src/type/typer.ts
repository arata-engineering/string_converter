/** default */
export type HtmlElement_Null = HTMLElement | null;
export type HTMLFormElement_Null = HTMLFormElement | null;

export type IsHankaku = (c: number)=>boolean;

/** 最上位呼び出し元Func */
export type CountFunc = (inputWord: string, count: CountUp)=>number;
export type CountUp = (c: number, length:number, isHankaku: IsHankaku) => number;

export type CountFuncUtf8 = (inputWord: string)=>number;
export type CountUpUtf8 = (str: string)=>number;

/** 文字タイプ */
export type Length = "length";
export type Sjis = "sjis";
export type Utf8 = "utf8";
export type Space = " ";
export type NewLine = "\n";
export type Charsets = Length | Sjis | Utf8 | Space | NewLine;
