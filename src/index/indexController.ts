import { Length, Sjis, Utf8 } from "../type/typer.js";
import IndexBean from "./indexBean.js";

document.getElementById("stringForm")?.addEventListener("input", inputExecute);
function inputExecute() {
    const indexBean: IndexBean = IndexBean.createInstance();
    const utf8: Utf8 = "utf8";
    const sjis: Sjis = "sjis";
    const length: Length = "length";

    // コンバート文字列
    indexBean.dispConvertedString();
    // 文字数
    indexBean.dispStringContents(length, "stringLengthArea", null);
    // UTF-8
    indexBean.dispStringContents(utf8, "stringByteArea", null);
    // SJIS
    indexBean.dispStringContents(sjis, "stringSjisArea", indexBean.countUpSjis);
    // 全角
    indexBean.dispStringContents(sjis, "stringZenkakuArea", indexBean.countUpZenkakuChar);
    // 半角
    indexBean.dispStringContents(sjis, "stringHankakuArea", indexBean.countUpHankakuChar);
}