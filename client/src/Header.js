import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { getAuth, signOut } from "firebase/auth";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(
        "Header auth state changed:",
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
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  function logout() {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }

  const username = userInfo?.username;
  console.log("Username in Header:", username);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      <Link to="/" className="logo">
        CryptBloG
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <button onClick={logout}>Logout ({username})</button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
