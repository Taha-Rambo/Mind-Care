document.addEventListener("DOMContentLoaded", () => {
  // ربط زر تحميل التقرير
  const downloadBtn = document.getElementById("download-report");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadReport);
  }
});

/* =========================
   حساب النتيجة الكلية
   ========================= */
function calculateTotalScore() {
  // مثال: لو عندك مصفوفة إجابات باسم answers وكل خيار له score
  // عدّل هذا الجزء إذا كان حسابك مختلف
  if (!window.answers || !Array.isArray(window.answers)) return 0;

  let total = 0;
  window.answers.forEach(q => {
    if (typeof q === "number") total += q;
  });
  return total;
}

/* =========================
   تحميل التقرير
   ========================= */
function downloadReport() {
  const total = calculateTotalScore();
  const date = new Date().toLocaleString("ar-SA");

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>تقرير Mind Care</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f7fafc;
    padding: 40px;
  }
  .card {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  h2 { color: #4c51bf; }
  .score {
    font-size: 22px;
    margin: 20px 0;
  }
  .note {
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }
</style>
</head>
<body>
  <div class="card">
    <h2>🧠 تقرير Mind Care</h2>
    <p><strong>التاريخ:</strong> ${date}</p>
    <div class="score"><strong>النتيجة:</strong> ${total}</div>
    <p class="note">
      هذا التقييم استرشادي فقط ولا يُعد تشخيصًا طبيًا.
      في حال وجود أعراض شديدة أو أفكار مؤذية، يُنصح بطلب مساعدة مختص.
    </p>
  </div>
</body>
</html>
`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "mind-care-report.html";
  a.click();

  URL.revokeObjectURL(url);
}
