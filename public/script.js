document.addEventListener("DOMContentLoaded", async () => {
  const userSelect = document.getElementById("userSelect");
  const manualInput = document.getElementById("manualName");
  const confirmBtn = document.getElementById("confirmNameBtn");
  const greeting = document.getElementById("greeting");

  // Load names from the server
  try {
    const res = await fetch("/people");
    const people = await res.json();

    people.forEach(person => {
      const option = document.createElement("option");
      option.value = person.name;
      option.textContent = person.name;
      userSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load names:", err);
  }

  // If already logged in
  const saved = localStorage.getItem("userName");
  if (saved) {
    greeting.textContent = `👋 Vitaj, ${saved}!`;
  }

  // Confirm name (selected or typed)
  confirmBtn.addEventListener("click", async () => {
    const selected = userSelect.value;
    const typed = manualInput.value.trim();
    const name = selected || typed;

    if (!name) {
      alert("Zadaj alebo vyber meno");
      return;
    }

    // Save or validate name via backend
    const res = await fetch("/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userName", name);
      greeting.textContent = `👋 Vitaj, ${name}!`;
    
      window.location.href = "/turnaje.html";
    } else {
      alert("Chyba: " + data.message);
    }
  });
});
