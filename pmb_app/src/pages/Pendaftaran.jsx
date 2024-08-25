import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pendaftaran() {
  const [formData, setFormData] = useState({
    name: "",
    addressKTP: "",
    currentAddress: "",
    district: "",
    city: "",
    province: "",
    phone: "",
    mobilePhone: "",
    email: "",
    nationality: "WNI Asli",
    birthDate: "",
    birthPlace: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    mathScore: "",
    englishScore: "",
    indonesianScore: "",
  });

  const [photo, setPhoto] = useState(null); // State untuk menyimpan file foto
  const [photoPreview, setPhotoPreview] = useState(null); // State untuk menyimpan URL pratinjau

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file); // Menyimpan file foto
    setPhotoPreview(URL.createObjectURL(file)); // Membuat URL pratinjau
  };

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data provinsi saat komponen di-mount
    fetch("http://localhost:5000/getProvinsi")
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      province: selectedProvince,
      city: "",
      district: "",
    });

    // Fetch cities based on selected province
    fetch(`http://localhost:5000/getKota?province_id=${selectedProvince}`)
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({ ...formData, city: selectedCity, district: "" });

    // Fetch districts based on selected city
    fetch(`http://localhost:5000/getKecamatan?regency_id=${selectedCity}`)
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    // Tambahkan data form lainnya ke dalam FormData
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    // Debugging log untuk melihat isi formData
    console.log(
      "Isi formData sebelum menambahkan foto:",
      Array.from(data.entries())
    );

    // Tambahkan foto ke dalam FormData jika ada
    if (photo) {
      console.log("Foto berhasil disiapkan:", photo);
      data.append("photo", photo);
    } else {
      console.log("Foto tidak ditemukan.");
    }

    // Debugging log untuk melihat isi formData setelah menambahkan foto
    console.log(
      "Isi formData setelah menambahkan foto:",
      Array.from(data.entries())
    );

    // Kirim data menggunakan fetch
    fetch("http://localhost:5000/postData", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        console.log(data);
        // Navigasi ke halaman lain jika sukses
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              Formulir Pendaftaran Mahasiswa
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
            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Upload Foto:
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pratinjau Gambar */}
            {photoPreview && (
              <div className="flex items-center justify-center mt-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
            {[
              {
                label: "Nama Lengkap (sesuai ijazah disertai gelar):",
                name: "name",
                type: "text",
                required: true,
              },
              {
                label: "Alamat KTP:",
                name: "addressKTP",
                type: "text",
                required: true,
              },
              {
                label: "Alamat Lengkap Saat Ini:",
                name: "currentAddress",
                type: "text",
              },
              {
                label: "Provinsi:",
                name: "province",
                type: "select",
                options: provinces.map((prov) => ({
                  value: prov.id,
                  label: prov.name,
                })),
                required: true,
                onChange: handleProvinceChange,
              },
              {
                label: "Kabupaten/Kota:",
                name: "city",
                type: "select",
                options: cities.map((city) => ({
                  value: city.id,
                  label: city.name,
                })),
                required: true,
                onChange: handleCityChange,
              },
              {
                label: "Kecamatan:",
                name: "district",
                type: "select",
                options: districts.map((district) => ({
                  value: district.id,
                  label: district.name,
                })),
                required: true,
              },
              { label: "Nomor Telepon:", name: "phone", type: "tel" },
              { label: "Nomor HP:", name: "mobilePhone", type: "tel" },
              { label: "Email:", name: "email", type: "email" },
              {
                label: "Tanggal Lahir (sesuai ijazah):",
                name: "birthDate",
                type: "date",
              },
              {
                label: "Tempat Lahir (sesuai ijazah):",
                name: "birthPlace",
                type: "text",
              },
              //   {
              //     label: "Nilai Matematika:",
              //     name: "mathScore",
              //     type: "number",
              //     required: true,
              //   },
              //   {
              //     label: "Nilai Bahasa Inggris:",
              //     name: "englishScore",
              //     type: "number",
              //     required: true,
              //   },
              //   {
              //     label: "Nilai Bahasa Indonesia:",
              //     name: "indonesianScore",
              //     type: "number",
              //     required: true,
              //   },
            ].map((field, index) => (
              <div key={index} className="flex items-center">
                <label className="w-1/3 text-left text-gray-700 font-semibold">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={field.onChange || handleChange}
                    required={field.required}
                    className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Pilih {field.label}</option>
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Kewarganegaraan:
              </label>
              <div className="w-2/3 flex space-x-4">
                {["WNI Asli", "WNI Keturunan", "WNA"].map((option, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name="nationality"
                      value={option}
                      checked={formData.nationality === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                    {/* {option === "WNA" && ( // Show input for WNA nationality only when selected
                      <input
                        type="text"
                        name="wnaNationality"
                        value={formData.Nationality}
                        onChange={handleChange}
                        placeholder="Masukkan kewarganegaraan"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4 ${
                          formData.nationality !== "WNA" ? "hidden" : "" // Hide input when nationality is not WNA
                        }`}
                      />
                    )} */}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Jenis Kelamin:
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Status Menikah:
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Status Menikah</option>
                <option value="Belum menikah">Belum menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Lain-lain">Lain-lain (janda/duda)</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Agama:
              </label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Pilih Agama</option>
                <option value="Islam">Islam</option>
                <option value="Katolik">Katolik</option>
                <option value="Kristen">Kristen</option>
                <option value="Hindu">Hindu</option>
                <option value="Budha">Budha</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
            {/* <div className="grid grid-cols-3 gap-4"> */}
            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Nilai Matematika:
              </label>
              <input
                type="number"
                name="mathScore"
                value={formData.mathScore}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Nilai Bahasa Inggris:
              </label>
              <input
                type="number"
                name="englishScore"
                value={formData.englishScore}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-left text-gray-700 font-semibold">
                Nilai Bahasa Indonesia:
              </label>
              <input
                type="number"
                name="indonesianScore"
                value={formData.indonesianScore}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* </div> */}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-6">
              Daftar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Pendaftaran;
