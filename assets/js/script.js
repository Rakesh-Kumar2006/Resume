document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/data/data.json")
    .then(res => res.json())
    .then(data => {
      console.log("Data loaded:", data); // debug
      displayResume(data);
    })
    .catch(err => console.error("Error loading JSON:", err));
});

function displayResume(data) {
  const resume = document.getElementById("resume");

  resume.innerHTML = `
    <div class="header">
      <img src="${data.profile}" class="profile-img mb-3">
      <h1>${data.name}</h1>
      <h5>${data.title}</h5>
      <p>${data.email} | ${data.phone}</p>
    </div>

    <div class="section">
      <h2>Skills</h2>
      <ul>
        ${data.skills.map(skill => `<li>${skill}</li>`).join("")}
      </ul>
    </div>

    <div class="section">
      <h2>Education</h2>
      ${data.education.map(edu => `
  <p>
    <strong>${edu.degree}</strong><br>
    ${edu.college} (${edu.year})<br>
    ${edu.percentage ? `Percentage: ${edu.percentage}` : ""}
  </p>
`).join("")}
    </div>

    <div class="section">
  <h2>Projects</h2>
  ${data.projects.map(project => `
    <p>
      <strong>${project.title}</strong><br>
      ${project.description}
    </p>
  `).join("")}
</div>

    <div class="section">
      <h2>Experience</h2>
      ${data.experience.map(exp => `
        <p>
          <strong>${exp.role}</strong> - ${exp.company}<br>
          ${exp.duration}<br>
          ${exp.description}
        </p>
      `).join("")}
    </div>
  `;
}

// PDF Download
function downloadPDF() {
  const { jsPDF } = window.jspdf;

  const resume = document.querySelector("#resume");

  html2canvas(resume, {
    scale: 2,          // better quality
    useCORS: true,
    scrollY: -window.scrollY
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Extra pages if content is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  });
}