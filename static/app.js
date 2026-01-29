// =============================================================
// Supabase connection settings
// =============================================================

// TODO: Replace these with your real values from Supabase
// Supabase → Settings → Data API → Project URL
const API_URL = "https://lfbgyaavffihpezqkafj.supabase.co";

// Supabase → Settings → API Keys → Create new API keys → Publishable key
const API_KEY = "sb_publishable_gOZ2Oz0QSx3MG5yVD6Zi6g_IvcprIKH";

// Name of the table you created in Supabase
const APPOINTMENTS_TABLE = "appointments";

console.log("JavaScript loaded");
console.log("Using Supabase:", API_URL);


// =============================================================
// Run when the page has finished loading
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");

  // When the form is submitted, stop the page reloading and add the appointment
  form.addEventListener("submit", async (event) => {
    event.preventDefault();      // stop the default form submit (page reload)
    await addAppointment();      // run our function to send data to Supabase
  });

  // Load existing appointments when the page opens
  loadAppointments();
});


// =============================================================
// Add a new appointment (CREATE)
// =============================================================

async function addAppointment() {
  // 1. Read values from the form
  const name = document.getElementById("nameInput").value.trim();
  const date = document.getElementById("dateInput").value;
  const notes = document.getElementById("notesInput").value.trim();

  // 2. Basic validation
  if (name === "" || date === "") {
    alert("Please fill in patient name and appointment date.");
    return;
  }

  // 3. Build the object using Supabase column names
  // These property names MUST match your Supabase table columns
  const body = {
    patient_name: name,      // column: patient_name
    appointment_date: date,  // column: appointment_date
    notes: notes             // column: notes
  };

  try {
    // 4. Send a POST request to Supabase
    const response = await fetch(`${API_URL}/rest/v1/${APPOINTMENTS_TABLE}`, {
      method: "POST",
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Supabase add error:", err);
      alert("Could not add appointment. Check the console for details.");
      return;
    }

    alert("Appointment booked successfully.");

    // 5. Clear the form inputs
    document.getElementById("nameInput").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("notesInput").value = "";

    // 6. Reload the list of appointments
    loadAppointments();

  } catch (error) {
    console.error(error);
    alert("Something went wrong while adding the appointment.");
  }
}


// =============================================================
// Load all appointments from Supabase (READ)
// =============================================================

async function loadAppointments() {
  const list = document.getElementById("appointments-list");
  list.innerHTML = "<li>Loading appointments...</li>";

  try {
    const response = await fetch(`${API_URL}/rest/v1/${APPOINTMENTS_TABLE}?select=*`, {
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Supabase load error:", err);
      list.innerHTML = "<li>Could not load appointments.</li>";
      return;
    }

    const appointments = await response.json();

    if (appointments.length === 0) {
      list.innerHTML = "<li>No appointments found.</li>";
      return;
    }

    // Build list items from the data
    list.innerHTML = appointments.map(a => `
      <li>
        <strong>${a.patient_name}</strong>
        on ${a.appointment_date}
        ${a.notes ? `- ${a.notes}` : ""}
      </li>
    `).join("");

  } catch (error) {
    console.error(error);
    list.innerHTML = "<li>Error loading appointments.</li>";
  }
}

