import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // State untuk menyimpan data username dan password dari API
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data username dan password dari API saat komponen dimuat
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAkun"); // Ganti dengan URL API Anda
        const data = await response.json();
        setUsers(data); // Simpan data pengguna di state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Periksa apakah username dan password cocok dengan data yang di-fetch dari API
    const user = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    );

    if (user) {
      console.log("Login berhasil");

      // Simpan token dummy atau data lainnya ke localStorage
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("username", formData.username);
      localStorage.setItem("email", user.email); // Simpan nama dari data user

      // Arahkan ke halaman utama
      navigate("/");
    } else {
      // Jika username atau password salah, tampilkan pesan error
      setError("Username atau password salah!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2">
            Login
          </button>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200 mr-2">
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
