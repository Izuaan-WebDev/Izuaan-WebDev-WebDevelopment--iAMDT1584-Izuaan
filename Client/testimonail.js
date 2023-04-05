const testielements = document.querySelector(".testimonials");
const API_URL = "http://localhost:5000/testimonials";

const listalltestimonials = () => {
  const testimonialsList = document.getElementById("Table");
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        // Create table header row
        const headerRow = document.createElement("tr");
        const fullnameHeader = document.createElement("th");
        fullnameHeader.textContent = "Full Name";
        headerRow.appendChild(fullnameHeader);

        const companyName = document.createElement("th");
        companyName.textContent = "Company Name";
        headerRow.appendChild(companyName);

        const comment = document.createElement("th");
        comment.textContent = "Comment";
        headerRow.appendChild(comment);

        // Add header row to table body
        testimonialsList.appendChild(headerRow);

        data.forEach((testimonial) => {
          // Create table row and cells
          const row = document.createElement("tr");

          const fullnameCell = document.createElement("td");
          fullnameCell.textContent = testimonial.fullname;
          row.appendChild(fullnameCell);

          const companyNameCell = document.createElement("td");
          companyNameCell.textContent = testimonial.company_name;
          row.appendChild(companyNameCell);

          const commentCell = document.createElement("td");
          commentCell.textContent = testimonial.comment;
          row.appendChild(commentCell);

          // Add row to table body
          testimonialsList.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "No testimonials found.";
        row.appendChild(cell);
        testimonialsList.appendChild(row);
      }
    });
};

document.addEventListener("DOMContentLoaded", function () {
  listalltestimonials();

  //   testimonial button listner
  const testimonailForm = document.querySelector("#TestimonialForm");
  testimonailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(testimonailForm);
    const Fname = formData.get("Fname");
    const Cname = formData.get("Cname");
    const Content = formData.get("Content");

    const testimonial = {
      Fname,
      Cname,
      Content,
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(testimonial),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((createdtestimonial) => {
        console.log(createdtestimonial);
      })
      .finally(() => {
        listalltestimonials();
      });
  });
});
