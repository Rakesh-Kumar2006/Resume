document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/data/data.json")
    .then(res => res.json())
    .then(data => {
      console.log("Data loaded:", data);
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

    <!-- Technical Skills -->
    <div class="section avoid-break">
      <h2>Technical Skills</h2>
      <p><strong>Frontend:</strong> ${data.skills.frontend?.join(", ") || "N/A"}</p>
      <p><strong>Frameworks:</strong> ${data.skills.frameworks?.join(", ") || "N/A"}</p>
      <p><strong>Backend:</strong> ${data.skills.backend?.join(", ") || "N/A"}</p>
      <p><strong>Database:</strong> ${data.skills.database?.join(", ") || "N/A"}</p>
    </div>

    <!-- Languages -->
    <div class="section avoid-break">
      <h2>Languages Known</h2>
      <ul>
        ${data.languages?.map(lang => `<li>${lang}</li>`).join("") || "<li>N/A</li>"}
      </ul>
    </div>

    <!-- Education -->
    <div class="section avoid-break">
      <h2>Education</h2>
      ${data.education?.map(edu => `
        <p>
          <strong>${edu.degree}</strong><br>
          ${edu.college} (${edu.year})<br>
          ${edu.percentage ? `Percentage: ${edu.percentage}` : ""}
        </p>
      `).join("") || "<p>N/A</p>"}
    </div>

  <div class="section page-break">
  <h2>Projects</h2>
  <div class="project-block">
    ${data.projects.map(project => `
      <div class="project-item">
        <strong>${project.title}</strong><br>
        ${project.description}
      </div>
    `).join("")}
  </div>
</div>

    <!-- Experience -->
    <div class="section avoid-break">
      <h2>Experience</h2>
      ${
        data.experience && data.experience.length > 0
          ? data.experience.map(exp => `
            <p>
              <strong>${exp.role}</strong> - ${exp.company}<br>
              ${exp.duration}<br>
              ${exp.description}
            </p>
          `).join("")
          : `<p><strong>Fresher</strong> - Currently seeking opportunities to apply my skills and grow professionally.</p>`
      }
    </div>
  `;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const resume = document.querySelector("#resume");

  window.scrollTo(0, 0);

  html2canvas(resume, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageHeight = 295;
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    const imgData = canvas.toDataURL("image/png");

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Fix overlapping issue
    while (heightLeft > 0) {
      position = position - pageHeight;

      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  });
}