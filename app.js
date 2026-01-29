async function createPaste() {
  const content = document.getElementById("content").value;
  const ttl = document.getElementById("ttl").value;
  const views = document.getElementById("views").value;

  if (!content.trim()) {
    alert("Content required");
    return;
  }

  const body = { content };
  if (ttl) body.ttl_seconds = parseInt(ttl);
  if (views) body.max_views = parseInt(views);

  const res = await fetch("/api/pastes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Error creating paste");
    return;
  }

  document.getElementById("result").innerHTML = `
    Paste created:<br>
    <a href="${data.url}" target="_blank">${data.url}</a>
  `;
}
