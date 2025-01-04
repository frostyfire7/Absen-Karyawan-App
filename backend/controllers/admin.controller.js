const db = require("../models");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Admin = db.admin;

exports.create = async (req, res) => {
  try {
    const adminTerdaftar = await Admin.findOne({
      email: req.body.email,
    });

    if (adminTerdaftar) {
      const token = jwt.sign({ adminId: adminTerdaftar._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).send({
        message: "Admin sudah terdaftar",
        token,
        data: adminTerdaftar,
      });
    }

    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).send({
        message: "Nama, email dan password harus diisi untuk mendaftar",
      });
    }

    const adminBaru = new Admin({
      nama: nama,
      email: email,
      password: await bcrypt.hash(password, 10),
    });

    const adminTersimpan = await adminBaru.save();

    const token = jwt.sign({ adminId: adminTersimpan._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Admin baru berhasil didaftarkan",
      token,
      data: adminTersimpan,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error terjadi saat menambahkan admin",
    });
  }
};

exports.findAll = [
  auth,
  async (req, res) => {
    try {
      const admin = await Admin.find();
      res.status(200).send({
        message: "Berhasil mendapatkan seluruh admin",
        data: admin,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error saat menampilkan seluruh admin",
      });
    }
  },
];

exports.findOne = [
  auth,
  async (req, res) => {
    try {
      const adminId = req.params.id;
      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).send({
          message: "Admin tidak ditemukan",
        });
      }
      res.status(200).send({
        message: `Admin dengan ID ${adminId} berhasil ditemukan`,
        data: admin,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error menampilkan admin",
      });
    }
  },
];

exports.update = [
  auth,
  async (req, res) => {
    try {
      const adminId = req.params.id;
      const updateAdmin = await Admin.findByIdAndUpdate(adminId, req.body, { new: true });
      if (!updateAdmin) {
        return res.status(404).send({
          message: `Admin dengan ID ${adminId} tidak ditemukan atau tidak dapat diupdate`,
        });
      }
      res.status(200).send({
        message: `Admin dengan ID ${adminId} berhasil diupdate`,
        data: updateAdmin,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error terjadi saat mengupdate admin",
      });
    }
  },
];

exports.delete = [
  auth,
  async (req, res) => {
    try {
      const karyawanId = req.userId;
      const targetKaryawanId = req.params.id;
      if (karyawanId !== targetKaryawanId) {
        return res.status(403).send({
          message: "Anda tidak punya akses untuk menghapus karyawan",
        });
      }
      const hapusKaryawan = await Karyawan.findByIdAndDelete(targetKaryawanId);
      if (!hapusKaryawan) {
        return res.status(404).send({
          message: "Karyawan tidak ditemukan",
        });
      }
      res.status(200).send({
        message: "Karyawan berhasil dihapus",
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Error menghapus karyawan",
      });
    }
  },
];
