import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";

function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/getData"); // Ganti dengan URL API yang sesuai
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Ambil username dari localStorage saat komponen dimuat
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Hapus token dan username dari localStorage saat logout
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Setel state username menjadi kosong
    // setUsername("");

    // Arahkan kembali ke halaman login
    navigate("/login");
  };

  const handlePendaftaran = () => {
    navigate("/pendaftaran");
  };

  const handleUser = () => {
    navigate("/user");
  };

  const handleEdit = (id) => {
    console.log(`Edit data with ID: ${id}`);
    navigate(`/editData/${id}`);
  };

  const handlePrint = (id) => {
    console.log(`Print data with ID: ${id}`);
    navigate(`/printData/${id}`);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/deleteData/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Deleted:", data);
        setData(data);
        fetchData();
      })
      .catch((error) => console.error("Error deleting data:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center">
            {username != "admin" && (
              <button
                onClick={handlePendaftaran}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2">
                Pendaftaran Mahasiswa
              </button>
            )}
            {/* {username != "admin" && (
              <button
                onClick={handlePrint}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2">
                Print Data
              </button>
            )} */}
            {username === "admin" && (
              <button
                onClick={handleUser}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2">
                Data User
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">
              Logout
            </button>
          </div>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">Nama Siswa</th>
              <th className="py-2 px-4 border-b">Nilai Matematika</th>
              <th className="py-2 px-4 border-b">Nilai Bahasa Indonesia</th>
              <th className="py-2 px-4 border-b">Nilai Bahasa Inggris</th>
              <th className="py-2 px-4 border-b">Nilai Rataan</th>
              {username === "admin" && (
                <th className="py-2 px-4 border-b">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Contoh data statis, bisa diganti dengan data dinamis dari API */}

            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{item.nama_siswa}</td>
                  <td className="py-2 px-4 border-b">{item.nilai_mat}</td>
                  <td className="py-2 px-4 border-b">{item.nilai_bindo}</td>
                  <td className="py-2 px-4 border-b">{item.nilai_bing}</td>
                  <td className="py-2 px-4 border-b">
                    {numeral(item.nilai_rataan).format("0.000")}
                  </td>
                  {username === "admin" && (
                    <td className="flex py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleEdit(item.id_siswa)} // Assuming 'id_siswa' is the unique identifier
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 mr-2">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_siswa)} // Assuming 'id_siswa' is the unique identifier
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 mr-2">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <></>
            )}
            {/* Tambahkan lebih banyak data jika diperlukan */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
