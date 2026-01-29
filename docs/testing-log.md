# Testing Log – MediHealth Appointments

This log records the tests you have done on your project.
Be honest. You still get marks for fixing problems.

---

## Test 1 – Add appointment with normal data

Input:
- patient_name: "Sam Patel"
- appointment_date: "2025-03-10"
- notes: "First check-up"

Expected result:
- Appointment is added.
- A success message appears.
- The new appointment appears in the list on the page.
- The new row appears in the Supabase `appointments` table.

Actual result:
[write what happened here]

Fix / change made:
[write what you changed, or write "None, it worked"]


---

## Test 2 – Missing patient name

Input:
- patient_name: "" (empty)
- appointment_date: "2025-03-10"
- notes: "Annual check"

Expected result:
- The system should not send the data.
- An error or warning should tell the user to fill in the required fields.

Actual result:
[write what happened here]

Fix / change made:
[describe any validation you added or changed]


---

## Test 3 – Missing appointment date

Input:
- patient_name: "Alex Green"
- appointment_date: "" (empty)
- notes: "Follow-up"

Expected result:
- Warning that appointment date is required.

Actual result:
[write what happened]

Fix / change made:
[details]


---

## Test 4 – Check data appears in Supabase

Action:
- Open Supabase → Table Editor → `appointments`.

Expected result:
- All booked appointments from the form appear as rows in the table.

Actual result:
[write what you saw]

Fix / change made:
[e.g. fixed column names, created table correctly, etc.]


---

## Final testing summary

Write a short summary of what you tested and what you fixed.

Example:
"I tested normal data, missing fields and checked that forms were saved in Supabase. I had to fix the column names in my JavaScript and add basic validation to stop empty forms."

Your summary:
[write here]
