document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tournaments");
  const userName = localStorage.getItem("userName");

  if (!userName) {
    alert("Nie si prihlásený. Prosím, vráť sa späť.");
    window.location.href = "/";
    return;
  }

  // Načítanie turnajov
  const res = await fetch("/events");
  const events = await res.json();

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <h2>${event.name}</h2>
      <p><strong>Miesto:</strong> ${event.location}</p>
      <p><strong>Dátum:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><a href="${event.link}" target="_blank">🔗 Viac info</a></p>
      <button>Idem!</button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", async () => {
      const response = await fetch("/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          eventId: event._id
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Si prihlásený na turnaj!");
        button.disabled = true;
        button.textContent = "Už ideš";
      } else {
        alert("❌ Chyba: " + data.message);
      }
    });

    container.appendChild(card);
  });
});
