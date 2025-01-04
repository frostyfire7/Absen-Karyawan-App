const db = require("../models");
const Karyawan = db.karyawan;
const Absen = db.absen;

exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) {
      return res.status(404).send({
        message: "Karyawan tidak ditemukan",
      });
    }

    const absenHariIni = await Absen.findOne({
      karyawanId: karyawan._id,
      tanggalAbsen: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (absenHariIni) {
      return res.status(500).send({
        message: "Anda sudah melakukan absen hari ini",
      });
    }

    const absen = await Absen.create({
      karyawanId: karyawan._id,
      tanggalAbsen: new Date(),
      checkIn: new Date(),
      lokasi: req.body.lokasi,
      foto: req.body.foto,
    });

    await Karyawan.findByIdAndUpdate(karyawan._id, { absensi: true });

    res.status(201).send({
      message: "Check-in berhasil!",
      data: absen,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) {
      return res.status(404).send({
        message: "Karyawan tidak ditemukan",
      });
    }

    const absenHariIni = await Absen.findOne({
      karyawanId: karyawan._id,
      tanggalAbsen: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!absenHariIni) {
      return res.status(400).send({
        message: "Anda belum melakukan check-in hari ini",
      });
    }

    if (absenHariIni.checkOut) {
      return res.status(500).send({
        message: "Anda sudah melakukan check-out hari ini",
      });
    }

    const updateAbsen = await Absen.findByIdAndUpdate(
      absenHariIni._id,
      {
        checkOut: new Date(),
      },
      { new: true }
    );

    await Karyawan.findByIdAndUpdate(karyawan._id, { absensi: false });

    res.status(200).send({
      message: "Check-out berhasil!",
      data: updateAbsen,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const absen = await Absen.find().populate("karyawanId", "nama email absensi");
    res.status(200).send({
      message: "Berhasil mendapatkan seluruh absen",
      data: absen,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error saat menampilkan seluruh absen",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const absenId = req.params.id;
    const absen = await Absen.findById(req.params.id);
    if (!absen) {
      return res.status(404).send({
        message: "Absen tidak ditemukan",
      });
    }
    res.status(200).send({
      message: `Absen dengan ID ${absenId} berhasil didapatkan`,
      data: absen,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error menampilkan absen",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const absenId = req.params.id;
    const updateAbsen = await Absen.findByIdAndUpdate(absenId, req.body, { new: true }).populate(
      "karyawanId",
      "nama email absensi"
    );
    if (!updateAbsen) {
      return res.status(404).send({
        message: `Absen dengan ID ${absenId} tidak ditemukan atau tidak dapat diupdate`,
      });
    }
    res.status(200).send({
      message: `Absen dengan ID ${absenId} berhasil diupdate`,
      data: updateAbsen,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error terjadi saat mengupdate absen",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const absen = await Absen.findById(req.params.id);
    if (!absen) {
      return res.status(404).send({
        message: "Absen tidak ditemukan",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (absen.tanggalAbsen >= today && absen.tanggalAbsen < new Date(today.getTime() + 24 * 60 * 60 * 1000)) {
      await Karyawan.findByIdAndUpdate(absen.karyawanId, { absensi: false });
    }

    await Absen.findByIdAndDelete(req.params.id);

    res.status(200).send({
      message: "Absen berhasil dihapus",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error menghapus absen",
    });
  }
};
