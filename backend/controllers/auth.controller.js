const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = db.admin;
const Karyawan = db.karyawan;

exports.loginKaryawan = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "Email dan password harus diisi",
      });
    }

    const karyawan = await Karyawan.findOne({ email });
    if (!karyawan) {
      return res.status(401).send({
        message: "Email atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, karyawan.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign({ karyawanId: karyawan._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login karyawan berhasil",
      token,
      data: {
        karyawanId: karyawan._id,
        nama: karyawan.nama,
        email: karyawan.email,
        role: karyawan.role,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error saat karyawan login",
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email dan password harus diisi",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).send({
        message: "Email atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login admin berhasil",
      token,
      data: {
        adminId: admin._id,
        nama: admin.nama,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error saat admin login",
    });
  }
};
