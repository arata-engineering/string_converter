import IndexBean from "./indexBean.js";
document.getElementById("stringForm")?.addEventListener("input", inputExecute);
function inputExecute() {
    const indexBean = IndexBean.createInstance();
    const utf8 = "utf8";
    const sjis = "sjis";
    const length = "length";
    const space = " ";
    const newLine = "\n";
    // コンバート文字列
    indexBean.dispConvertedString();
    // 文字数
    indexBean.dispStringContents(length, "stringLengthArea", null);
    // UTF-8
    indexBean.dispStringContents(utf8, "stringByteArea", null);
    // SJIS
    indexBean.dispStringContents(sjis, "stringSjisArea", indexBean.countUpSjis);
    // 文字数(全角)
    indexBean.dispStringContents(sjis, "stringZenkakuArea", indexBean.countUpZenkakuChar);
    // 文字数(半角)
    indexBean.dispStringContents(sjis, "stringHankakuArea", indexBean.countUpHankakuChar);
    // 文字数(スペース)
    indexBean.dispStringContents(space, "stringSpaceArea", null);
    // 文字数(改行)
    indexBean.dispStringContents(newLine, "stringLineArea", null);
}
