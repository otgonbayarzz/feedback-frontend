import React, { createContext, useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";

export default function index(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLogged()) Router.push("/home");
    else Router.push("/home");
  }, []);

  const isLogged = () => {
    return localStorage.getItem("Authorization") ? true : false;
  };

  return <div></div>;
}
