const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { createPool } = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "db_pmb",
  connectionLimit: 10,
});

app.get("/getAkun", (req, res) => {
  pool.query("SELECT * FROM akun", (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});

app.get("/getAkun/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM akun WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});

app.post("/postAkun", (req, res) => {
  const newData = req.body;

  pool.query(
    "INSERT INTO akun (username, password, email) VALUES (?, ?, ?)",
    [newData.username, newData.password, newData.email],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        return res.status(500).json({ error: "Failed to add new data" });
      }
      console.log("New data added:", { id: result.insertId, ...newData });
      res.status(201).json({ message: "Data added successfully", newData });
    }
  );
});

app.put("/putAkun/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  pool.query(
    "UPDATE akun SET email=?, username=?, password=? WHERE id = ?",
    [updatedData.email, updatedData.username, updatedData.password, id],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ error: "Failed to update data" });
      }
      console.log("Data updated:", { id: id, ...updatedData });
      res
        .status(200)
        .json({ message: "Data updated successfully", updatedData });
    }
  );
});

app.delete("/deleteAkun/:id", (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM akun WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Failed to delete data" });
    }

    console.log(`Data with id ${id} deleted successfully`);
    res.status(200).json({ message: "Data deleted successfully" });
  });
});

app.get("/getProvinsi", (req, res) => {
  pool.query("SELECT * FROM reg_provinces", (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result);
  });
});

app.get("/getKota", (req, res) => {
  const { province_id } = req.query;
  pool.query(
    "SELECT * FROM reg_regencies WHERE province_id = ?",
    province_id,
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
    }
  );
});

app.get("/getKecamatan", (req, res) => {
  const { regency_id } = req.query;
  pool.query(
    "SELECT * FROM reg_districts WHERE regency_id = ?",
    regency_id,
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
    }
  );
});

app.get("/getData", (req, res) => {
  pool.query(
    "SELECT * FROM data_siswa ORDER BY nilai_rataan DESC",
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
    }
  );
});

app.get("/getData/:id", (req, res) => {
  const id = req.params.id;

  pool.query(
    "SELECT * FROM data_siswa WHERE id_siswa = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
    }
  );
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Adjust path if needed
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/postData", upload.single("photo"), (req, res) => {
  const newData = req.body;
  const photoPath = req.file ? req.file.path : null;
  console.log("Uploaded file:", req.file);

  const mean =
    (parseFloat(newData.mathScore) +
      parseFloat(newData.indonesianScore) +
      parseFloat(newData.englishScore)) /
    3;

  pool.query(
    `INSERT INTO data_siswa (nama_siswa, alamat_ktp, alamat_sekarang, kecamatan, kabupaten, provinsi, no_telp, no_hp, email, kewarganegaraan, tgl_lahir, tempat_lahir, jenis_kelamin, status_menikah, agama, nilai_mat, nilai_bindo, nilai_bing, nilai_rataan, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newData.name,
      newData.addressKTP,
      newData.currentAddress,
      newData.district,
      newData.city,
      newData.province,
      newData.phone,
      newData.mobilePhone,
      newData.email,
      newData.nationality,
      newData.birthDate,
      newData.birthPlace,
      newData.gender,
      newData.maritalStatus,
      newData.religion,
      newData.mathScore,
      newData.indonesianScore,
      newData.englishScore,
      //   (newData.englishScore + newData.mathScore + newData.indonesianScore) / 3,
      mean,
      photoPath ? photoPath : null, // jika photo null, kirim null
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        return res.status(500).json({ error: "Failed to add new data" });
      }
      console.log("New data added:", { id: result.insertId, ...newData });
      res.status(201).json({ message: "Data added successfully", newData });
    }
  );
});

app.put("/putData/:id", upload.single("photo"), (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const photoPath = req.file ? req.file.path : null;
  console.log("Uploaded file:", req.file);

  const mean =
    (parseFloat(newData.mathScore) +
      parseFloat(newData.indonesianScore) +
      parseFloat(newData.englishScore)) /
    3;

  pool.query(
    `UPDATE data_siswa SET nama_siswa=?, alamat_ktp=?, alamat_sekarang=?, kecamatan=?, kabupaten=?, provinsi=?, no_telp=?, no_hp=?, email=?, kewarganegaraan=?, tgl_lahir=?, tempat_lahir=?, jenis_kelamin=?, status_menikah=?, agama=?, nilai_mat=?, nilai_bindo=?, nilai_bing=?, nilai_rataan=?, foto=? WHERE id_siswa = ?`,
    [
      newData.name,
      newData.addressKTP,
      newData.currentAddress,
      newData.district,
      newData.city,
      newData.province,
      newData.phone,
      newData.mobilePhone,
      newData.email,
      newData.nationality,
      newData.birthDate,
      newData.birthPlace,
      newData.gender,
      newData.maritalStatus,
      newData.religion,
      newData.mathScore,
      newData.indonesianScore,
      newData.englishScore,
      //   (newData.englishScore + newData.mathScore + newData.indonesianScore) / 3,
      mean,
      photoPath ? photoPath : null, // jika photo null, kirim null
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ error: "Failed to update data" });
      }
      console.log("Data updated:", { id: id, ...newData });
      res.status(200).json({ message: "Data updated successfully", newData });
    }
  );
});

app.delete("/deleteData/:id", (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(
    "DELETE FROM data_siswa WHERE id_siswa = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ error: "Failed to delete data" });
      }

      console.log(`Data with id ${id} deleted successfully`);
      res.status(200).json({ message: "Data deleted successfully" });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
