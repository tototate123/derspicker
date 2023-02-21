import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      if (response.ok) {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
          setRedirect(true);
        });
      } else {
        console.error("API request failed:", response.status, response.statusText);
        setError("Falsche Eingaben");
      }
    } catch (error) {
      console.error("API request failed:", error);
      setError("Es gab ein Problem bei der Anfrage.");
    }
  }
  
  
  

  // Reset error state on new form submission
  function handleFormSubmit() {
    setError(null);
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <><div>{error && <div className="IndexPageError">Leider gibt es keine antwort vom Server. Probiere es später erneut oder sende uns eine E-Mail:</div>}</div>
    <form className="login" onSubmit={login} onSubmitCapture={handleFormSubmit}>
      <h1>Anmelden</h1>
      <input
        type="text"
        placeholder="Benutzername"
        required
        value={username}
        onChange={(ev) => setUsername(ev.target.value)} />
      <input
        type="password"
        placeholder="Passwort"
        required
        value={password}
        onChange={(ev) => setPassword(ev.target.value)} />
      <button>Anmelden</button>
    </form></>
  );
}
