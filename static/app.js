// ------------------------------------------------------------
// MediHealth Premium Booking JS (Modular, ES6+, Clean Architecture)
// ------------------------------------------------------------

// API CONFIG --------------------------------------------------
const API = {
  url: "https://lfbgyaavffihpezqkafj.supabase.co",
  key: "sb_publishable_gOZ2Oz0QSx3MG5yVD6Zi6g_IvcprIKH",
};

// DOM SELECTORS ----------------------------------------------
const DOM = {
  form: document.getElementById("appointmentForm"),
  list: document.getElementById("appointmentsList"),
  status: document.getElementById("status"),
  cancelEdit: document.getElementById("cancelEdit"),
  submit: document.getElementById("submitBtn"),
  inputs: {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    date: document.getElementById("date"),
    time: document.getElementById("time"),
    reason: document.getElementById("reason"),
    notes: document.getElementById("notes"),
  },
};

// UTILITIES ---------------------------------------------------
const Utils = {
  async fetchJSON(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        apikey: API.key,
        Authorization: `Bearer ${API.key}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  },

  showStatus(message, type = "success") {
    DOM.status.textContent = message;
    DOM.status.className = `status status-${type}`;
    DOM.status.style.opacity = "1";
    setTimeout(() => (DOM.status.style.opacity = "0"), 3000);
  },

  clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });
  },

  validate() {
    const errors = {};
    const { name, email, date, time } = DOM.inputs;

    if (!name.value.trim()) errors.name = "Name required";
    if (!email.value.trim() || !email.value.includes("@"))
      errors.email = "Valid email required";
    if (!date.value) errors.date = "Date required";
    if (!time.value) errors.time = "Time required";

    return errors;
  },
};

// DATA OPERATIONS ---------------------------------------------
const Appointments = {
  getAll: () => Utils.fetchJSON(`${API.url}/rest/v1/appointments?select=*`),

  create: (data) =>
    Utils.fetchJSON(`${API.url}/rest/v1/appointments`, {
      method: "POST",
      body: JSON.stringify([data]),
      headers: {
        "Prefer": "return=representation"
      }
    }),

  update: (appointment_id, data) =>
    Utils.fetchJSON(`${API.url}/rest/v1/appointments?appointment_id=eq.${appointment_id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Prefer": "return=representation"
      }
    }),

  remove: (appointment_id) =>
    Utils.fetchJSON(`${API.url}/rest/v1/appointments?appointment_id=eq.${appointment_id}`, {
      method: "DELETE",
      headers: {
        "Prefer": "return=representation"
      }
    }),
};

// UI LOGIC -----------------------------------------------------
const UI = {
  editingID: null,

  renderList(items) {
    DOM.list.innerHTML = "";

    if (!items.length) {
      DOM.list.innerHTML = `<li>No appointments yet.</li>`;
      return;
    }

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "appointment-item";
      li.innerHTML = `
        <strong>${item.patient_name}</strong> — ${item.patient_email}<br />
        ${item.appointment_date} at ${item.appointment_time}
        <div class="appointment-controls">
          <button data-edit="${item.appointment_id}" class="btn-secondary">Edit</button>
          <button data-delete="${item.appointment_id}" class="btn-secondary">Delete</button>
        </div>
      `;
      DOM.list.appendChild(li);
    });
  },

  fillForm(data) {
    DOM.inputs.name.value = data.patient_name;
    DOM.inputs.email.value = data.patient_email;
    DOM.inputs.date.value = data.appointment_date;
    DOM.inputs.time.value = data.appointment_time;
    DOM.inputs.reason.value = data.reason_for_visit || "";
    DOM.inputs.notes.value = data.notes || "";
  },

  resetForm() {
    DOM.form.reset();
    Utils.clearErrors();
    UI.editingID = null;
    DOM.cancelEdit.hidden = true;
    DOM.submit.querySelector(".btn-label").textContent = "Book Appointment";
  },
};

// EVENT HANDLERS ----------------------------------------------
DOM.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  Utils.clearErrors();

  const errors = Utils.validate();
  if (Object.keys(errors).length) {
    Object.entries(errors).forEach(([field, msg]) => {
      const err = document.getElementById(`error-${field}`);
      err.textContent = msg;
      err.style.display = "block";
    });
    return;
  }

  // Build payload with only valid columns
  const payload = {
    patient_name: DOM.inputs.name.value.trim(),
    patient_email: DOM.inputs.email.value.trim(),
    appointment_date: DOM.inputs.date.value,
    appointment_time: DOM.inputs.time.value,
    reason_for_visit: DOM.inputs.reason.value.trim()
    // notes: DOM.inputs.notes.value.trim(), // Remove if not in table
  };

  try {
    if (UI.editingID) {
      await Appointments.update(Number(UI.editingID), payload);
      Utils.showStatus("Appointment updated");
    } else {
      await Appointments.create(payload);
      Utils.showStatus("Appointment created");
    }
    UI.resetForm();
    loadAppointments();
  } catch (error) {
    Utils.showStatus(error.message || "Supabase error", "error");
  }
});

DOM.list.addEventListener("click", async (e) => {
  if (e.target.dataset.edit) {
    const appointment_id = e.target.dataset.edit;
    UI.editingID = appointment_id;

    const items = await Appointments.getAll();
    const appt = items.find((x) => String(x.appointment_id) === String(appointment_id));

    UI.fillForm(appt);
    DOM.submit.querySelector(".btn-label").textContent = "Update Appointment";
    DOM.cancelEdit.hidden = false;
  }

  if (e.target.dataset.delete) {
    if (confirm("Delete this appointment?")) {
      await Appointments.remove(e.target.dataset.delete);
      Utils.showStatus("Appointment deleted");
      loadAppointments();
    }
  }
});

DOM.cancelEdit.addEventListener("click", () => UI.resetForm());

// INITIAL LOAD ------------------------------------------------
async function loadAppointments() {
  const items = await Appointments.getAll();
  UI.renderList(items);
}

document.addEventListener("DOMContentLoaded", loadAppointments);