import IndexBean from "./indexBean.js";
/*
document.getElementById("stringForm")?.addEventListener("submit", submitExecute);
function submitExecute(event: Event): void {
    const indexBean: IndexBean = IndexBean.createInstance();
    indexBean.dispConvertedString();
    event.stopPropagation();
    event.preventDefault();
}
*/
document.getElementById("stringForm")?.addEventListener("input", inputExecute);
function inputExecute() {
    const indexBean = IndexBean.createInstance();
    indexBean.dispConvertedString();
    indexBean.dispStringLength();
    indexBean.dispStringByte();
    indexBean.dispStringSjis();
    indexBean.dispStringZenkaku();
    indexBean.dispStringHankaku();
}
