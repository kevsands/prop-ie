"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("⌛ loading…");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/health`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setMessage(`✅ backend says: ${data.status}`))
      .catch(() => setMessage("❌ cannot reach the backend"));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Prop.ie Platform front‑end</h1>
      <p>{message}</p>
    </main>
  );
}
