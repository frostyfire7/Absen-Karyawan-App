module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      absenId: { type: String },
      karyawanId: { type: mongoose.Schema.Types.ObjectId, ref: "karyawan", required: true },
      tanggalAbsen: { type: Date, default: Date.now },
      checkIn: { type: Date, default: Date.now },
      checkOut: { type: Date },
      lokasi: { type: String, required: true },
      foto: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.absenId = _id;
    return object;
  });

  return mongoose.model("absen", schema);
};
