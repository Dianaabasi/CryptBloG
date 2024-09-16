import React, { useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(
        "Auth state changed:",
        user ? "Authenticated" : "Not authenticated"
      );
      if (user) {
        setUserInfo({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
        });
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function login(ev) {
    ev.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed! Invalid Details`);
    }
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
