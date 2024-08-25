import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editUsers, setEditUsers] = useState({
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/getAkun/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEditUsers({
          email: data.email,
          username: data.username,
          password: data.password,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUsers((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data yang sudah diubah ke API
    fetch(`http://localhost:5000/putAkun/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editUsers),
    })
      .then((response) => {
        if (response.ok) {
          // Jika sukses, arahkan ke halaman sebelumnya atau halaman lain
          navigate("/user");
        } else {
          console.error("Failed to update data");
        }
      })
      .catch((error) => console.error("Error updating data:", error));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Edit Akun
            </h2>

            <button
              onClick={handleBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 mb-6">
              Back
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="text"
                name="email"
                value={editUsers.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Username:</label>
              <input
                type="text"
                name="username"
                value={editUsers.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={editUsers.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditUser;
