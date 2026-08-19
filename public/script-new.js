// ===== Sidebar Toggle =====

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");

hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

function getStudentData(form) {
  const formData = new FormData(form);
  return {
    fullName: formData.get("fullName").trim(),
    email: formData.get("email").trim().toLowerCase(),
    phone: formData.get("phone").trim(),
    course: formData.get("course").trim(),
    address: formData.get("address").trim(),
  };
}

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
    showAlert("Students load nahi ho sake!", "error");
  }
}

function renderTable(students) {
  tableBody.innerHTML = "";

  if (students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Not Student Found.</td></tr>`;
    return;
  }

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
  const { fullName, email, phone, course, address } =
    getStudentData(studentForm);

  // Validation
  if (!validateForm(fullName, email, phone, course, address)) {
    return;
  }

  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, course, address }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      showAlert(errorData.error || "Student add nahi ho saka", "error");
      return;
    }

    showAlert("✅ Student add ho gya!", "success");
    studentForm.reset();
    loadStudents();
  } catch (err) {
    showAlert("Server error! Dobara try karo.", "error");
  }
});

// 3) Edit + Delete buttons -> dynamic events

function attachRowEvents() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const student = allStudents.find((s) => s._id === id);

      if (!student) {
        showAlert("Student nahi mila!", "error");
        return;
      }

      editForm.studentId.value = student._id;
      editForm.fullName.value = student.fullName;
      editForm.email.value = student.email;
      editForm.phone.value = student.phone;
      editForm.course.value = student.course;
      editForm.address.value = student.address;

      editCard.style.display = "block";
      editCard.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const student = allStudents.find((s) => s._id === id);

      const confirmDelete = confirm(`${student.fullName} ko delete karna hai?`);
      if (confirmDelete) {
        try {
          const res = await fetch(`/api/students/${id}`, { method: "DELETE" });

          if (!res.ok) {
            showAlert("Delete nahi ho saka!", "error");
            return;
          }

          showAlert("✅ Student delete ho gya!", "success");
          loadStudents();
        } catch (err) {
          showAlert("Server error!", "error");
        }
      }
    });
  });
}

// 4) Edit Form -> PUT

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editForm.studentId.value;
  const { fullName, email, phone, course, address } = getStudentData(editForm);

  // Validation
  if (!validateForm(fullName, email, phone, course, address)) {
    return;
  }

  try {
    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, course, address }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      showAlert(errorData.error || "Update nahi ho saka", "error");
      return;
    }

    showAlert("✅ Student update ho gya!", "success");
    editCard.style.display = "none";
    loadStudents();
  } catch (err) {
    showAlert("Server error!", "error");
  }
});

cancelEdit.addEventListener("click", () => {
  editCard.style.display = "none";
});

// 5) Search filter

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allStudents.filter((s) =>
    (s.fullName + s.email + s.phone).toLowerCase().includes(value),
  );
  renderTable(filtered);
});
