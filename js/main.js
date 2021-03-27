"use strict";

const loadingModal = new bootstrap.Modal(document.getElementById("loadingModal"), { backdrop: "static" });

// textareaを自動リサイズ
const analyzeText = document.getElementById("analyzeText");
analyzeText.oninput = event => {
    event.target.style.height = "0px";
    event.target.style.height = event.target.scrollHeight + "px";
};

// 解析ボタンが押されたら
document.getElementById("analyze").onclick = () => {
    // ローディングモーダルを表示
    loadingModal.show();

    // 解析するテキストが空ならエラー
    const analyzeTextValue = analyzeText.value.replaceAll("\n", "");
    if (!analyzeTextValue) {
        loadingModal.hide();
        new bootstrap.Modal(document.getElementById("errorModal"), { backdrop: "static" }).show();
        return;
    }

    // 解析
    let startTime;
    function showResult(result) {
        const endTime = performance.now();

        const resultText = document.getElementById("resultText");
        resultText.value = JSON.stringify(result, null, 4);
        resultText.style.height = "0px";
        resultText.style.height = resultText.scrollHeight + "px";
        document.getElementById("resultTime").value = (endTime - startTime) / 1000;

        // ローディングモーダルを隠す
        loadingModal.hide();
    }
    if (document.getElementById("useStandard").checked) {
        startTime = performance.now();
        kuromoji.builder({ dicPath: "./js/dicts/standard/" }).build((err, tokenizer) => {
            showResult(tokenizer.tokenize(analyzeTextValue));
        });
    } else if (document.getElementById("useNeologd").checked) {
        startTime = performance.now();
        kuromoji.builder({ dicPath: "./js/dicts/neologd/" }).build((err, tokenizer) => {
            showResult(tokenizer.tokenize(analyzeTextValue));
        });
    } else {
        startTime = performance.now();
        showResult(new TinySegmenter().segment(analyzeTextValue));
    }
};