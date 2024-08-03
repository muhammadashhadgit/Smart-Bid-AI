require("dotenv").config({ path: "./config.env" }); // Specify the path to config.env
const mongoose = require("mongoose");
const pbkdf2 = require("pbkdf2");
const Admin = require("./models/adminModel");

// Connect to MongoDB using the dbURL from config.env
mongoose
  .connect(process.env.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
    createAdmin();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

async function createAdmin() {
  try {
    const adminEmail = process.env.adminEmail;
    const adminPassword = process.env.adminPassword;
    const adminExists = await Admin.findOne({ emailAddress: adminEmail });

    if (adminExists) {
      console.log("Admin already exists");
    } else {
      const salt = "smartbid-secret"; // Our Secret key
      const hashedPassword = pbkdf2
        .pbkdf2Sync(adminPassword, salt, 1, 32, "sha512")
        .toString("hex");
      const admin = new Admin({
        firstName: "Admin",
        lastName: "User",
        emailAddress: adminEmail,
        password: hashedPassword,
        wallet: 0,
      });

      await admin.save();
      console.log("Admin created successfully");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.connection.close();
  }
}
