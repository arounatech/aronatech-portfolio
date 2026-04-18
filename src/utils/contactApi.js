const API_ENDPOINT = "/api/contact";

export async function sendContactMessage(payload) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message || "Unable to send your message right now. Please try again.";
    throw new Error(message);
  }

  return data;
}
