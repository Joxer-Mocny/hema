async function submitPassword() {
  const password = document.getElementById("password").value;

  const response = await fetch("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  const data = await response.json();

  if (response.ok) {
    window.location.href = "/dashboard.html";
  } else {
    alert("❌ Wrong password");
  }
}
