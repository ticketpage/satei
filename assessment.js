function submitAssessment() {
    let form = document.getElementById("assessmentForm");
    let formData = new FormData(form);
    let queryString = new URLSearchParams();
    let unansweredQuestions = [];

    let questions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
    for (let question of questions) {
        if (!formData.has(question)) {
            unansweredQuestions.push(question);
        }
    }

    if (unansweredQuestions.length > 0) {
        document.getElementById("alert").style.display = "block";
        return;
    }

    formData.forEach((value, key) => {
        let [answer, score] = value.split(":");
        queryString.append(key + "_answer", answer);
        queryString.append(key + "_score", score);
    });

    window.location.href = "result.html?" + queryString.toString();
}

function getQueryParams() {
    let params = new URLSearchParams(window.location.search);
    let baseScore = 100;
    let totalDeduction = 0;
    let specialComments = [];

    params.forEach((value, key) => {
        if (key.includes("_score")) {
            totalDeduction += parseInt(value);
        }
    });

    let answers = [];
    params.forEach((value, key) => {
        if (key.includes("_answer")) {
            answers.push(value);
        }
    });

    let specialCommentMap = {
        "予定が合えば行く": "ほぼ全通が基本なので、予定が合えば行くというスタンスでは論外です。",
        "自枠だけ買います": "そもそも最前管理とは複数枠投げ合えるから組織化してるのであり、投げられないオタクは要りません。",
        "LINEグループに入ってスプシ埋められます": "誰でもLINEグループに入ってスプシ埋められますよ。",
        "住む世界が違う雑魚": "おまいつやモブをバカにしてヘイトを溜めてるから運営がクレーム対応のために本人確認とかされるようになるんです。",
        "繋がってます": "推しメンとの関係がどうであれ、やることやっててくれたらそれでいいです。"
    };

    answers.forEach(answer => {
        if (specialCommentMap[answer]) {
            specialComments.push(specialCommentMap[answer]);
        }
    });

    let finalScore = Math.max(baseScore - totalDeduction, 0);
    document.getElementById("finalScore").innerText = `あなたの点数: ${finalScore}点`;

    let generalComment = "";
    if (finalScore == 100) {
        generalComment = "最前管理の道を極めましょう。";
    } else if (finalScore >= 90) {
        generalComment = "見込みありです。";
    } else if (finalScore >= 70) {
        generalComment = "正直、厳しいです。有能おまいつの地位を目指すのが妥当かと思います。";
    } else if (finalScore >= 50) {
        generalComment = "なんで最前に入りたいの？その程度の熱量なら一生モブでいいのでは";
    } else {
        generalComment = "在宅オタクがお似合い";
    }

    let commentHTML = `<p>${generalComment}</p>`;
    if (specialComments.length > 0) {
        commentHTML += `<p>${specialComments.join(" ")}</p>`;
    }

    document.getElementById("comment").innerHTML = commentHTML;
}

if (window.location.pathname.includes("result.html")) {
    window.onload = getQueryParams;
}