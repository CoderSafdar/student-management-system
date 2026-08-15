
// ===== Sidebar Toggle =====

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");

hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// ===== Student Management =====

const tableBody = document.querySelector(".tableBody");
const studentForm = document.getElementById("studentForm");
const editForm = document.getElementById("editForm");
const editCard = document.getElementById("editCard");
const cancelEdit = document.getElementById("cancelEdit");
const searchInput = document.querySelector(".search-input");

let allStudents = []; // search filter 


loadStudents();

async function loadStudents() {
  try {
    const res = await fetch("/api/students");
    const data = await res.json();
    allStudents = data;
    renderTable(data);
  } catch (err) {
    console.log("Error loading students");
  }
}

function renderTable(students) {
  tableBody.innerHTML = "";
  students.forEach((s, index) => {
    tableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${s.fullName}</td>
        <td>${s.email}</td>
        <td>${s.phone}</td>
        <td>${s.course}</td>
        <td>
          <button class="btn-edit" data-id="${s._id}">✎ Edit</button>
          <button class="btn-delete" data-id="${s._id}">🗑 Delete</button>
        </td>
      </tr>`;
  });
  attachRowEvents(); 
}

// 2) Add Student -> POST

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(studentForm);
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const course = formData.get("course");
  const address = formData.get("address");

  try {
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, course, address })
    });
    studentForm.reset();
    loadStudents();
  } catch (err) {
    console.log("Error adding student");
  }
});

// 3) Edit + Delete buttons -> dynamic events 

function attachRowEvents() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const student = allStudents.find((s) => s._id === id);

      editForm.studentId.value = student._id;
      editForm.fullName.value = student.fullName;
      editForm.email.value = student.email;
      editForm.phone.value = student.phone;
      editForm.course.value = student.course;
      editForm.address.value = student.address;

      editCard.style.display = "block";
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Are you sure you want to delete this student?");
      if (confirmDelete) {
        try {
          await fetch(`/api/students/${id}`, { method: "DELETE" });
          loadStudents();
        } catch (err) {
          console.log("Error deleting student");
        }
      }
    });
  });
}

// 4) Edit Form -> PUT

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editForm.studentId.value;
  const fullName = editForm.fullName.value;
  const email = editForm.email.value;
  const phone = editForm.phone.value;
  const course = editForm.course.value;
  const address = editForm.address.value;

  try {
    await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, course , address})
    });
    editCard.style.display = "none";
    loadStudents();
  } catch (err) {
    console.log("Error updating student");
  }
});

cancelEdit.addEventListener("click", () => {
  editCard.style.display = "none";
});

// 5) Search filter 

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allStudents.filter((s) =>
    (s.fullName + s.email + s.phone).toLowerCase().includes(value)
  );
  renderTable(filtered);
});