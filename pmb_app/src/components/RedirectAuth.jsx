import React from "react";
import { Navigate } from "react-router-dom";

// Fungsi untuk memeriksa apakah pengguna sudah login
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function RedirectAuth({ element }) {
  // Jika pengguna sudah login, arahkan ke halaman dashboard
  return isAuthenticated() ? <Navigate to="/" replace /> : element;
}

export default RedirectAuth;
