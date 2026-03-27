/* =============================================
   TODAY I LEARNED — STUDY TRACKER
   Frontend Logic: script.js
   ============================================= */

// ---- 1. BACKEND URL ----
// This is where our Express server runs.
// When you run the server with `node server.js`, it listens on port 5000.
const API_BASE = "/api";

// ---- 2. GRAB ALL HTML ELEMENTS ----
// We grab references to all the HTML elements we'll need to interact with.
const datePicker     = document.getElementById("datePicker");
const itemInput      = document.getElementById("itemInput");
const addItemBtn     = document.getElementById("addItemBtn");
const saveBtn        = document.getElementById("saveBtn");
const previewSection = document.getElementById("previewSection");
const previewList    = document.getElementById("previewList");
const statusMsg      = document.getElementById("statusMsg");
const dateList       = document.getElementById("dateList");
const emptyState     = document.getElementById("emptyState");
const displaySection = document.getElementById("displaySection");
const displayDate    = document.getElementById("displayDate");
const displayList    = document.getElementById("displayList");
const noDataMsg      = document.getElementById("noDataMsg");
const closeDisplay   = document.getElementById("closeDisplay");

// ---- 3. TRACK ITEMS IN MEMORY ----
// This array temporarily holds items the user adds before clicking Save.
// It's just a JavaScript array — it lives in the browser memory, not the database.
let pendingItems = [];

// ---- 4. SET DATE PICKER LIMITS ----
// We only allow dates from today to 12 months from now.
function setDateLimits() {
  const today = new Date();

  // Format: YYYY-MM-DD (the format HTML date inputs need)
  const todayStr = today.toISOString().split("T")[0];

  // Calculate 12 months ahead
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 12);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Apply min and max to the date input element
  datePicker.min = todayStr;
  datePicker.max = maxDateStr;

  // Set today's date as the default value
  datePicker.value = todayStr;
}

// Run this when the page loads
setDateLimits();

// ---- 5. ADD ITEM TO PREVIEW LIST ----
// When user clicks "+ Add", we add the item to our pendingItems array
// and show it in the preview list (below the input).
addItemBtn.addEventListener("click", () => {
  const text = itemInput.value.trim(); // .trim() removes extra spaces

  // Don't add empty items
  if (!text) {
    showStatus("Please enter something before adding!", "error");
    return;
  }

  // Add to our in-memory array
  pendingItems.push(text);

  // Clear the input so user can type the next item
  itemInput.value = "";

  // Re-render the preview list
  renderPreviewList();

  // Focus back on input for convenience
  itemInput.focus();
});

// ---- Allow pressing Enter to add an item (instead of clicking the button) ----
itemInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addItemBtn.click();
  }
});

// ---- RENDER PREVIEW LIST ----
// This function draws the current pendingItems into the preview area.
function renderPreviewList() {
  previewList.innerHTML = ""; // Clear old content

  if (pendingItems.length === 0) {
    // If no items, hide the preview section
    previewSection.classList.add("hidden");
    return;
  }

  // Show the preview section
  previewSection.classList.remove("hidden");

  // Create a list item (<li>) for each pending item
  pendingItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Create a delete button for each item
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-item-btn";
    deleteBtn.title = "Remove this item";

    // When delete is clicked, remove item from array and re-render
    deleteBtn.addEventListener("click", () => {
      pendingItems.splice(index, 1); // Remove 1 item at position `index`
      renderPreviewList();
    });

    li.appendChild(deleteBtn);
    previewList.appendChild(li);
  });
}

// ---- 6. SAVE BUTTON: Send data to backend ----
saveBtn.addEventListener("click", async () => {
  const selectedDate = datePicker.value;

  // Validate: must have a date
  if (!selectedDate) {
    showStatus("Please select a date first.", "error");
    return;
  }

  // Validate: must have at least 1 item
  if (pendingItems.length === 0) {
    showStatus("Please add at least one study item.", "error");
    return;
  }

  // Disable button while saving (prevents double-click)
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    // Send a POST request to our backend
    // POST = "create/update data"
    const response = await fetch(`${API_BASE}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Tell the server we're sending JSON
      },
      body: JSON.stringify({
        date: selectedDate,   // e.g. "2026-03-24"
        items: pendingItems   // e.g. ["Learned JS", "Studied math"]
      })
    });

    // Parse the JSON response from the server
    const data = await response.json();

    if (response.ok) {
      // ✅ Success!
      showStatus(`✅ Saved ${pendingItems.length} item(s) for ${formatDate(selectedDate)}`, "success");

      // Clear the pending items
      pendingItems = [];
      renderPreviewList();

      // Refresh the date list on the right panel
      loadAllDates();
    } else {
      // Server returned an error
      showStatus(`Error: ${data.message || "Something went wrong."}`, "error");
    }

  } catch (err) {
    // Network error (e.g. server is not running)
    showStatus("❌ Could not connect to the server. Is it running?", "error");
    console.error("Save error:", err);
  }

  // Re-enable the button
  saveBtn.disabled = false;
  saveBtn.textContent = "💾 Save to Database";
});

// ---- 7. LOAD ALL DATES (shown in right panel) ----
// This fetches all saved dates from the backend and displays them.
async function loadAllDates() {
  try {
    // GET request: fetch all entries
    const response = await fetch(`${API_BASE}/entries`);
    const entries = await response.json();

    // Clear the current list
    dateList.innerHTML = "";

    if (!entries || entries.length === 0) {
      // Show empty state message
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a list item for each date entry
    entries.forEach(entry => {
      const li = document.createElement("li");

      // Format the date nicely for display
      const dateLabel = document.createElement("span");
      dateLabel.textContent = formatDate(entry.date);

      // Show how many items are saved for that date
      const countBadge = document.createElement("span");
      countBadge.className = "item-count";
      countBadge.textContent = `${entry.items.length} item${entry.items.length !== 1 ? "s" : ""}`;

      li.appendChild(dateLabel);
      li.appendChild(countBadge);

      // When user clicks a date, fetch and show items for it
      li.addEventListener("click", () => {
        // Remove 'active' from all items
        document.querySelectorAll(".date-list li").forEach(el => el.classList.remove("active"));
        // Mark this one as active (highlights it)
        li.classList.add("active");

        // Load and display items for this date
        loadEntriesForDate(entry.date);
      });

      dateList.appendChild(li);
    });

  } catch (err) {
    console.error("Failed to load dates:", err);
  }
}

// ---- 8. LOAD ENTRIES FOR A SPECIFIC DATE ----
// When user clicks a date, we fetch that date's items from the backend.
async function loadEntriesForDate(dateStr) {
  try {
    // GET request with date in the URL
    const response = await fetch(`${API_BASE}/entries/${dateStr}`);
    const data = await response.json();

    // Show the display section
    displaySection.classList.remove("hidden");

    // Set the heading to the selected date
    displayDate.textContent = `📖 ${formatDate(dateStr)}`;

    // Clear previous items
    displayList.innerHTML = "";
    noDataMsg.classList.add("hidden");

    if (!data || !data.items || data.items.length === 0) {
      // No data for this date
      noDataMsg.classList.remove("hidden");
      return;
    }

    // Add each item to the display list
    data.items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      displayList.appendChild(li);
    });

  } catch (err) {
    console.error("Failed to load entries for date:", err);
  }
}

// ---- 9. CLOSE DISPLAY PANEL ----
// When user clicks ✕, hide the display section.
closeDisplay.addEventListener("click", () => {
  displaySection.classList.add("hidden");
  // Also remove 'active' highlight from all date items
  document.querySelectorAll(".date-list li").forEach(el => el.classList.remove("active"));
});

// ---- 10. HELPER: Show Status Message ----
// Displays a success or error message below the save button.
function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = `status-msg ${type}`; // adds 'success' or 'error' class
  statusMsg.classList.remove("hidden");

  // Auto-hide after 4 seconds
  setTimeout(() => {
    statusMsg.classList.add("hidden");
  }, 4000);
}

// ---- 11. HELPER: Format Date for Display ----
// Converts "2026-03-24" → "Monday, March 24, 2026"
function formatDate(dateStr) {
  // We append T00:00:00 to prevent timezone shifts
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// ---- 12. ON PAGE LOAD ----
// When the page first opens, load all existing dates from the database.
loadAllDates();
