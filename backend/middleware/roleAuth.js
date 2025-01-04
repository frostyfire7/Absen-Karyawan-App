const jwt = require("jsonwebtoken");
const db = require("../models");
const Admin = db.admin;
const Karyawan = db.karyawan;

exports.authKaryawan = async (req, res, next) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({ message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const karyawan = await Karyawan.findById(decoded.karyawanId);

    if (!karyawan) {
      return res.status(401).send({ message: "Karyawan tidak valid" });
    }

    req.userId = decoded.karyawanId;
    req.userRole = "Karyawan";
    next();
  } catch (err) {
    return res.status(401).send({ message: "Token tidak valid" });
  }
};

exports.authAdmin = async (req, res, next) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send({ message: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).send({ message: "Admin tidak valid" });
    }

    req.userId = decoded.adminId;
    req.userRole = "Admin";
    next();
  } catch (err) {
    return res.status(401).send({ message: "Token tidak valid" });
  }
};
