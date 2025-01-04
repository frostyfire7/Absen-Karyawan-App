const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();
require("dotenv").config();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

db.mongoose
  .connect(db.url)
  .then(() => console.log("database terhubung"))
  .catch((err) => {
    console.log(`gagal menghubungkan ${err.message}`);
    process.exit();
  });

require("./routes/absen.routes")(app);
require("./routes/karyawan.routes")(app);
require("./routes/admin.routes")(app);
require("./routes/auth.routes")(app);

app.get("/", (req, res) => res.send("Server sedang berjalan!"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
