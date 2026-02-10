/* script.js - Mind Care (RTL) - works with your existing HTML/CSS IDs */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);

  function showScreen(screenId) {
    ["welcome-screen", "question-screen", "result-screen"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.classList.toggle("active", id === screenId);
    });
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // ---------- App State ----------
  const state = {
    currentQuestion: 0,
    answers: [], // store selected option index per question
  };

  // ---------- Questions ----------
  // (Same structure as yours: question + options{text, score})
  const questions = [
    {
      question: "كيف تصف مزاجك العام في الأسبوع الماضي؟",
      options: [
        { text: "ممتاز ومتفائل", score: 1 },
        { text: "جيد إلى حد ما", score: 2 },
        { text: "متقلب بين الجيد والسيء", score: 3 },
        { text: "سيء معظم الوقت", score: 4 },
        { text: "سيء جداً وميؤوس منه", score: 5 },
      ],
    },
    {
      question: "كم مرة شعرت بالقلق أو التوتر مؤخراً؟",
      options: [
        { text: "نادراً أو أبداً", score: 1 },
        { text: "أحياناً", score: 2 },
        { text: "عدة مرات في الأسبوع", score: 3 },
        { text: "يومياً تقريباً", score: 4 },
        { text: "باستمرار طوال اليوم", score: 5 },
      ],
    },
    {
      question: "كيف نوعية نومك في الآونة الأخيرة؟",
      options: [
        { text: "أنام بسهولة وأستيقظ نشيطاً", score: 1 },
        { text: "أنام بشكل طبيعي في معظم الأوقات", score: 2 },
        { text: "أواجه صعوبة أحياناً في النوم أو الاستيقاظ", score: 3 },
        { text: "أعاني من صعوبة في النوم أو استيقاظ متكرر", score: 4 },
        { text: "أرق شديد أو نوم مفرط", score: 5 },
      ],
    },
    {
      question: "مستوى طاقتك ونشاطك اليومي؟",
      options: [
        { text: "عالي ومليء بالحيوية", score: 1 },
        { text: "طبيعي ومناسب للأنشطة اليومية", score: 2 },
        { text: "أقل من المعتاد لكن لا يزال مقبولاً", score: 3 },
        { text: "منخفض ويؤثر على أنشطتي", score: 4 },
        { text: "منخفض جداً وأشعر بالإرهاق الدائم", score: 5 },
      ],
    },
    {
      question: "كيف تتعامل مع الضغوطات والتحديات؟",
      options: [
        { text: "أتعامل معها بثقة وهدوء", score: 1 },
        { text: "أتكيف معها بشكل جيد عموماً", score: 2 },
        { text: "أحتاج وقتاً أكثر لكني أتجاوزها", score: 3 },
        { text: "أشعر بالإرهاق وصعوبة في التأقلم", score: 4 },
        { text: "أشعر بالعجز التام أمامها", score: 5 },
      ],
    },
    {
      question: "مدى رضاك عن علاقاتك الاجتماعية؟",
      options: [
        { text: "راضٍ جداً ولدي دعم اجتماعي قوي", score: 1 },
        { text: "راضٍ إلى حد كبير", score: 2 },
        { text: "راضٍ نوعاً ما لكن أريد تحسينها", score: 3 },
        { text: "غير راضٍ وأشعر بالوحدة أحياناً", score: 4 },
        { text: "معزول اجتماعياً وأشعر بالوحدة الشديدة", score: 5 },
      ],
    },
    {
      question: "كيف تقيم قدرتك على التركيز والانتباه؟",
      options: [
        { text: "ممتازة ولا أواجه مشاكل", score: 1 },
        { text: "جيدة في معظم الأوقات", score: 2 },
        { text: "متوسطة مع صعوبات أحياناً", score: 3 },
        { text: "ضعيفة وتؤثر على عملي/دراستي", score: 4 },
        { text: "ضعيفة جداً وأجد صعوبة في التركيز", score: 5 },
      ],
    },
    {
      question: "مدى تقديرك لذاتك وثقتك بنفسك؟",
      options: [
        { text: "عالي وأثق بقدراتي", score: 1 },
        { text: "جيد ولدي ثقة معقولة بنفسي", score: 2 },
        { text: "متوسط ويتقلب حسب الظروف", score: 3 },
        { text: "منخفض وأشك في قدراتي كثيراً", score: 4 },
        { text: "منخفض جداً وأنتقد نفسي باستمرار", score: 5 },
      ],
    },
    {
      question: "هل تشعر بالاستمتاع بالأنشطة التي كنت تحبها سابقاً؟",
      options: [
        { text: "نعم، لا زلت أستمتع بها كما السابق", score: 1 },
        { text: "إلى حد ما، لكن أقل من السابق", score: 2 },
        { text: "قليلاً، وأحتاج جهد أكبر للاستمتاع", score: 3 },
        { text: "نادراً ما أستمتع بأي شيء", score: 4 },
        { text: "لا أستمتع بأي شيء تقريباً", score: 5 },
      ],
    },
    {
      question: "كيف تصف شهيتك للطعام مؤخراً؟",
      options: [
        { text: "طبيعية وصحية", score: 1 },
        { text: "جيدة إلى حد ما", score: 2 },
        { text: "متقلبة بين الزيادة والنقصان", score: 3 },
        { text: "ضعيفة أو مفرطة بشكل ملحوظ", score: 4 },
        { text: "فقدان كامل للشهية أو إفراط شديد", score: 5 },
      ],
    },
    {
      question: "مدى تكرار الأفكار السلبية أو المؤذية؟",
      options: [
        { text: "نادراً أو أبداً", score: 1 },
        { text: "أحياناً لكن أتجاوزها بسهولة", score: 2 },
        { text: "عدة مرات لكن أتحكم فيها", score: 3 },
        { text: "كثيراً وتؤثر على حياتي", score: 4 },
        { text: "باستمرار وأجد صعوبة في إيقافها", score: 5 },
      ],
    },
    {
      question: "هل تفكر في إيذاء نفسك أو الآخرين؟",
      options: [
        { text: "أبداً لم أفكر في ذلك", score: 1 },
        { text: "فكرت بذلك لكن بشكل عابر فقط", score: 2 },
        { text: "أحياناً تراودني مثل هذه الأفكار", score: 3 },
        { text: "كثيراً ما أفكر في ذلك", score: 4 },
        { text: "باستمرار ولدي خطط واضحة", score: 5 },
      ],
    },
    {
      question: "كيف تقيم قدرتك على اتخاذ القرارات؟",
      options: [
        { text: "ممتازة وأتخذ قرارات سليمة", score: 1 },
        { text: "جيدة في معظم الحالات", score: 2 },
        { text: "متوسطة مع تردد أحياناً", score: 3 },
        { text: "ضعيفة وأتردد كثيراً", score: 4 },
        { text: "عاجز عن اتخاذ أي قرارات", score: 5 },
      ],
    },
    {
      question: "مستوى الأمل والتفاؤل في حياتك؟",
      options: [
        { text: "عالي وأتطلع للمستقبل بإيجابية", score: 1 },
        { text: "جيد ولدي آمال واقعية", score: 2 },
        { text: "متوسط مع تقلبات في المشاعر", score: 3 },
        { text: "منخفض وأشعر بالتشاؤم كثيراً", score: 4 },
        { text: "منخفض جداً وأشعر باليأس", score: 5 },
      ],
    },
    {
      question: "هل تشعر بأعراض جسدية غير مبررة (صداع، آلام، خفقان)؟",
      options: [
        { text: "لا، صحتي الجسدية جيدة", score: 1 },
        { text: "أحياناً أعراض بسيطة", score: 2 },
        { text: "عدة أعراض لكن ليست شديدة", score: 3 },
        { text: "أعراض متكررة ومؤثرة", score: 4 },
        { text: "أعراض شديدة ومستمرة", score: 5 },
      ],
    },
  ];

  // ---------- UI refs ----------
  const el = {
    startBtn: null,
    nextBtn: null,
    prevBtn: null,
    questionText: null,
    answersContainer: null,
    counter: null,
    progress: null,

    resultIcon: null,
    resultTitle: null,
    resultSubtitle: null,
    resultDescription: null,
    recommendationsList: null,
    doctorAdvice: null,
    urgentWarning: null,

    retakeBtn: null,
    downloadBtn: null,
  };

  function cacheDom() {
    el.startBtn = $("start-test");
    el.nextBtn = $("next-btn");
    el.prevBtn = $("prev-btn");
    el.questionText = $("question-text");
    el.answersContainer = $("answers-container");
    el.counter = $("question-counter");
    el.progress = $("progress");

    el.resultIcon = $("result-icon");
    el.resultTitle = $("result-title");
    el.resultSubtitle = $("result-subtitle");
    el.resultDescription = $("result-description");
    el.recommendationsList = $("recommendations-list");
    el.doctorAdvice = $("doctor-advice");
    el.urgentWarning = $("urgent-warning");

    el.retakeBtn = $("retake-test");
    el.downloadBtn = $("download-report");
  }

  // ---------- Core Logic ----------
  function startTest() {
    state.currentQuestion = 0;
    state.answers = [];
    showScreen("question-screen");
    renderQuestion();
  }

  function renderQuestion() {
    const q = questions[state.currentQuestion];
    if (!q) return;

    // Question text + counter + progress
    el.questionText.textContent = q.question;
    el.counter.textContent = `${state.currentQuestion + 1} / ${questions.length}`;

    const pct = ((state.currentQuestion + 1) / questions.length) * 100;
    el.progress.style.width = `${pct}%`;

    // Answers
    el.answersContainer.innerHTML = "";
    const selectedIndex = state.answers[state.currentQuestion];

    q.options.forEach((opt, idx) => {
      const div = document.createElement("div");
      div.className = "answer-option";
      div.textContent = opt.text;

      if (selectedIndex === idx) div.classList.add("selected");

      div.addEventListener("click", () => selectAnswer(idx));
      el.answersContainer.appendChild(div);
    });

    // Buttons
    el.prevBtn.style.display = state.currentQuestion > 0 ? "inline-block" : "none";
    el.nextBtn.textContent =
      state.currentQuestion === questions.length - 1 ? "إنهاء التقييم" : "التالي";

    el.nextBtn.disabled = selectedIndex == null;
  }

  function selectAnswer(optionIndex) {
    state.answers[state.currentQuestion] = optionIndex;

    // Update selection UI
    const nodes = el.answersContainer.querySelectorAll(".answer-option");
    nodes.forEach((n, i) => n.classList.toggle("selected", i === optionIndex));

    el.nextBtn.disabled = false;

    // Safety: if user indicates high risk on self-harm item, show urgent warning early (optional)
    const isSelfHarmQuestion = questions[state.currentQuestion].question.includes("إيذاء نفسك");
    const score = questions[state.currentQuestion].options[optionIndex]?.score;

    if (isSelfHarmQuestion && score >= 4) {
      // Not blocking, just warning in console; final UI will also show on result.
      console.warn("High-risk response selected on self-harm question.");
    }
  }

  function nextQuestion() {
    if (state.answers[state.currentQuestion] == null) return;

    if (state.currentQuestion < questions.length - 1) {
      state.currentQuestion++;
      renderQuestion();
    } else {
      finishTest();
    }
  }

  function previousQuestion() {
    state.currentQuestion = clamp(state.currentQuestion - 1, 0, questions.length - 1);
    renderQuestion();
  }

  function calculateTotalScore() {
    let sum = 0;
    for (let i = 0; i < questions.length; i++) {
      const chosen = state.answers[i];
      const sc = questions[i]?.options?.[chosen]?.score ?? 0;
      sum += sc;
    }
    return sum;
  }

  function interpretScore(total) {
    // 15 questions -> min 15, max 75
    // Simple bands (you can tweak later)
    if (total <= 27) {
      return {
        icon: "✅",
        title: "مؤشرات جيدة",
        subtitle: "وضعك النفسي يبدو مستقراً بشكل عام",
        description:
          "نتيجتك تشير إلى ضغط/قلق منخفض إلى متوسط. استمر على عاداتك الإيجابية وراقب أي تغيّر مستمر.",
        recommendations: [
          "حافظ على وقت نوم واستيقاظ ثابت",
          "مشي خفيف 20 دقيقة 3 مرات أسبوعياً",
          "قلّل السوشال ميديا قبل النوم بساعة",
        ],
        doctorAdvice:
          "لا يبدو أنك تحتاج مراجعة عاجلة. إذا استمرت أعراض مزعجة أكثر من أسبوعين أو أثرت على حياتك، استشر مختصاً.",
        urgent: false,
      };
    }

    if (total <= 45) {
      return {
        icon: "⚠️",
        title: "ضغط/قلق متوسط",
        subtitle: "هناك مؤشرات تحتاج اهتمام",
        description:
          "النتيجة توحي بوجود ضغط أو قلق يؤثر على بعض جوانب حياتك. الأفضل تبدأ بخطوات عملية وتراقب التحسن خلال 2–4 أسابيع.",
        recommendations: [
          "نظّم نومك (وقت ثابت قدر الإمكان)",
          "خفّف الكافيين بعد العصر",
          "اكتب 3 مصادر قلق + خطوة صغيرة لكل واحد",
          "جرّب تنفّس 4-7-8 لمدة 3 دقائق يومياً",
        ],
        doctorAdvice:
          "إذا الأعراض أثرت على الدراسة/العمل أو زادت، استشارة مختص ستختصر عليك كثيراً.",
        urgent: false,
      };
    }

    return {
      icon: "🚨",
      title: "مؤشرات مرتفعة",
      subtitle: "قد تحتاج دعم متخصص",
      description:
        "نتيجتك تشير إلى أعراض قوية قد تؤثر بشكل واضح على حياتك اليومية (مثل القلق/الحزن/الأفكار السلبية).",
      recommendations: [
        "اطلب دعم شخص موثوق اليوم",
        "قلّل العزلة قدر الإمكان (تواصل بسيط أفضل من لا شيء)",
        "دوّن الأعراض وتوقيتها لتشرحها للمختص",
      ],
      doctorAdvice:
        "ننصح بمراجعة مختص نفسي قريباً. إذا كانت لديك أفكار لإيذاء نفسك أو الآخرين الآن، اطلب مساعدة فورية من شخص قريب أو تواصل مع جهة طوارئ في بلدك.",
      urgent: true,
    };
  }

  function hasHighRiskSelfHarmAnswer() {
    // Detect if user chose 4 or 5 on the self-harm question
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.includes("إيذاء نفسك")) continue;
      const idx = state.answers[i];
      const score = questions[i].options[idx]?.score ?? 0;
      return score >= 4;
    }
    return false;
  }

  function renderResult(result, total) {
    el.resultIcon.textContent = result.icon;
    el.resultTitle.textContent = result.title;
    el.resultSubtitle.textContent = `${result.subtitle} — (المجموع: ${total})`;
    el.resultDescription.textContent = result.description;

    el.recommendationsList.innerHTML = "";
    result.recommendations.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      el.recommendationsList.appendChild(li);
    });

    el.doctorAdvice.textContent = result.doctorAdvice;

    const urgent = result.urgent || hasHighRiskSelfHarmAnswer();
    el.urgentWarning.style.display = urgent ? "block" : "none";
  }

  function finishTest() {
    const total = calculateTotalScore();
    const result = interpretScore(total);

    renderResult(result, total);
    showScreen("result-screen");
  }

  function restartTest() {
    showScreen("welcome-screen");
    state.currentQuestion = 0;
    state.answers = [];
    // Reset question UI button state safely
    if (el.nextBtn) el.nextBtn.disabled = true;
  }

  function downloadReport() {
    const total = calculateTotalScore();
    const payload = {
      createdAt: new Date().toISOString(),
      totalScore: total,
      answers: state.answers,
      questionsCount: questions.length,
    };

    const text =
      "Mind Care Report\n\n" +
      `Date: ${payload.createdAt}\n` +
      `Score: ${payload.totalScore}\n` +
      `Answers (option indexes): ${JSON.stringify(payload.answers)}\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mindcare-report.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  // ---------- Init ----------
  function bindEvents() {
    el.startBtn?.addEventListener("click", startTest);
    el.nextBtn?.addEventListener("click", nextQuestion);
    el.prevBtn?.addEventListener("click", previousQuestion);
    el.retakeBtn?.addEventListener("click", restartTest);
    el.downloadBtn?.addEventListener("click", downloadReport);
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();

    // Basic safety checks (if any is null, it means HTML IDs mismatch)
    const mustIds = [
      "welcome-screen",
      "question-screen",
      "result-screen",
      "start-test",
      "next-btn",
      "prev-btn",
      "question-text",
      "answers-container",
      "question-counter",
      "progress",
      "result-icon",
      "result-title",
      "result-subtitle",
      "result-description",
      "recommendations-list",
      "doctor-advice",
      "urgent-warning",
      "retake-test",
      "download-report",
    ];

    const missing = mustIds.filter((id) => !$(id));
    if (missing.length) {
      console.error("Missing HTML elements (IDs):", missing);
      // Still bind what exists to avoid total break
    }

    bindEvents();
    showScreen("welcome-screen");
  });
})();
