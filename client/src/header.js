import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom"
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo =>{
        setUserInfo(userInfo);
      })
    })
  }, []);
  

function logout() {
  fetch("http://localhost:4000/logout", {
    credentials: 'include',
    method: 'POST',
  })
  setUserInfo(null);
}
const username = userInfo?.username;


    return(
        <header>
        <a href="/" className="logo">Der Spicker</a>
        <nav>
          {username && (
            <>
            <Link to="/create">Neuen Artikel erstellen</Link>
            <a onClick={logout}>Abmelden</a>
            </>
          )}
          {!username && (
            <>
            <Link to="/login">Anmelden</Link>
            <Link to="/register">Registrieren</Link>
            </>
          )}
        </nav>
      </header>
    );
}
