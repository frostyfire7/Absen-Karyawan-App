module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      karyawanId: { type: String },
      nama: { type: String, required: true },
      email: { type: String, required: true },
      noTelp: { type: String, required: true },
      alamat: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, default: "Karyawan" },
      absensi: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
    {
      timestamps: true,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.karyawanId = _id;
    return object;
  });

  return mongoose.model("karyawan", schema);
};
