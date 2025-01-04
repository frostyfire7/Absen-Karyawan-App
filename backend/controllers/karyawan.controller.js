const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Karyawan = db.karyawan;

exports.create = async (req, res) => {
  try {
    const karyawanTerdaftar = await Karyawan.findOne({
      email: req.body.email,
    });

    if (karyawanTerdaftar) {
      const token = jwt.sign({ karyawanId: karyawanTerdaftar._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).send({
        message: "Karyawan sudah terdaftar",
        token,
        data: karyawanTerdaftar,
      });
    }

    const { nama, email, password, noTelp, alamat } = req.body;

    if (!nama || !email || !password || !noTelp || !alamat) {
      return res.status(400).send({
        message: "Nama, email, password, notelp, dan alamat harus diisi untuk mendaftar",
      });
    }

    const karyawanBaru = new Karyawan({
      nama: nama,
      email: email,
      password: await bcrypt.hash(password, 10),
      noTelp: noTelp,
      alamat: alamat,
    });

    const karyawanTersimpan = await karyawanBaru.save();

    const token = jwt.sign({ karyawanId: karyawanTersimpan._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Karyawan baru berhasil didaftarkan",
      token,
      data: karyawanTersimpan,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error terjadi saat menambahkan karyawan",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const karyawan = await Karyawan.find();
    res.status(200).send({
      message: "Berhasil mendapatkan seluruh karyawan",
      data: karyawan,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error saat menampilkan seluruh karyawan",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const karyawanId = req.params.id;
    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) {
      return res.status(404).send({
        message: "Karyawan tidak ditemukan",
      });
    }
    res.status(200).send({
      message: `Karyawan dengan ID ${karyawanId} berhasil ditemukan`,
      data: karyawan,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error menampilkan karyawan",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const karyawanId = req.params.id;
    const updateKaryawan = await Karyawan.findByIdAndUpdate(karyawanId, req.body, { new: true });
    if (!updateKaryawan) {
      return res.status(404).send({
        message: `Karyawan dengan ID ${karyawanId} tidak ditemukan atau tidak dapat diupdate`,
      });
    }
    res.status(200).send({
      message: `Karyawan dengan ID ${karyawanId} berhasil diupdate`,
      data: updateKaryawan,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error terjadi saat mengupdate karyawan",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const targetKaryawanId = req.params.id;
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
};
