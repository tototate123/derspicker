import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function register(ev) {
    ev.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Registrierung erfolgreich.");
      } else {
        const errorMessage = await response.json();
        if (errorMessage === "RegisterNotEnabled") {
          setError("Registrierung ist derzeit deaktiviert. Bitte versuche es später erneut.");
        } else {
          setError("Registrierung fehlgeschlagen. Versuche es mit einem anderen Benutzernamen.");
        }
      }
    } catch (err) {
      setError("Leider gab es ein Problem mit dem Server. Bitte versuche es später erneut.");
      console.error("API request failed:", err);
    }
  }

  return (
    <>
      {error && <div className="IndexPageError">Leider gibt es keine antwort vom Server. Probiere es später erneut oder sende uns eine E-Mail:</div>}
      <form className="register" onSubmit={register}>
        <h1>Registrieren</h1>
        <input type="text" placeholder="Benutzername" required value={username} onChange={(ev) => setUsername(ev.target.value)} />
        <input type="password" placeholder="Passwort" required value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <button>Registrieren</button>
      </form>
    </>
  );
}
