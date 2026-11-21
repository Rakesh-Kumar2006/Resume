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

    <!-- Tools -->
    <div class="section avoid-break">
      <h2>Tools</h2>
      <p><strong>Build & Ship:</strong> ${data.tools?.buildAndShip?.join(", ") || "N/A"}</p>
      <p><strong>Design & UI:</strong> ${data.tools?.designAndUI?.join(", ") || "N/A"}</p>
      <p><strong>Server & Data:</strong> ${data.tools?.serverAndData?.join(", ") || "N/A"}</p>
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

    <div class="section projects">
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
  const projectsSection = resume.querySelector(".section.projects");

  window.scrollTo(0, 0);

  // Calculate 1 A4 page height in pixels based on #resume width
  const pdfWidth = 210;
  const pdfHeight = 297;
  const pageHeightPx = (resume.offsetWidth * pdfHeight) / pdfWidth;

  // Temporarily push Projects to the top of Page 2 for PDF export only
  if (projectsSection && projectsSection.offsetTop < pageHeightPx) {
    const currentMargin = parseFloat(getComputedStyle(projectsSection).marginTop) || 0;
    const gapToPage2 = pageHeightPx - projectsSection.offsetTop;
    projectsSection.style.marginTop = `${currentMargin + gapToPage2 + 25}px`;
  }

  html2canvas(resume, {
    scale: 2,
    useCORS: true
  })
    .then(canvas => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;
      const imgData = canvas.toDataURL("image/png");

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages (> 1 avoids blank trailing page from rounding)
      while (heightLeft > 1) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("resume.pdf");
    })
    .finally(() => {
      // Restore normal spacing on the webpage immediately
      if (projectsSection) {
        projectsSection.style.marginTop = "";
      }
    });
}