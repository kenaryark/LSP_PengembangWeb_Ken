import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function PrintData() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/getData/${id}`); // Ganti dengan URL API yang sesuai
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);
  const [editData, setEditData] = useState({
    name: "",
    addressKTP: "",
    currentAddress: "",
    district: "",
    city: "",
    province: "",
    phone: "",
    mobilePhone: "",
    email: "",
    nationality: "",
    birthDate: "",
    birthPlace: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    mathScore: "",
    englishScore: "",
    indonesianScore: "",
  });

  useEffect(() => {
    if (data.length > 0) {
      setEditData({
        name: data[0]?.nama_siswa,
        addressKTP: data[0]?.alamat_ktp,
        currentAddress: data[0]?.alamat_sekarang,
        district: data[0]?.kecamatan,
        city: data[0]?.kabupaten,
        province: data[0]?.provinsi,
        phone: data[0]?.no_telp,
        mobilePhone: data[0]?.no_hp,
        email: data[0]?.email,
        nationality: data[0]?.kewarganegaraan,
        birthDate: moment(data[0]?.tgl_lahir).format("YYYY-MM-DD"),
        birthPlace: data[0]?.tempat_lahir,
        gender: data[0]?.jenis_kelamin,
        maritalStatus: data[0]?.status_menikah,
        religion: data[0]?.agama,
        mathScore: data[0]?.nilai_mat,
        englishScore: data[0]?.nilai_bing,
        indonesianScore: data[0]?.nilai_bindo,
      });
    }
  }, [data]);
  console.log(editData);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
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
    setEditData({
      ...editData,
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
    setEditData({ ...editData, city: selectedCity, district: "" });

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
            ].map((field, index) => (
              <div key={index} className="flex items-center">
                <label className="w-1/3 text-left text-gray-700 font-semibold">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={editData[field.name]}
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
                    value={editData[field.name]}
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
                      checked={editData.nationality === option}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
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
                value={editData.gender}
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
                value={editData.maritalStatus}
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
                value={editData.religion}
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
                value={editData.mathScore}
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
                value={editData.englishScore}
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
                value={editData.indonesianScore}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-6">
              Print
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PrintData;
