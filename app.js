const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { refferalValidator } = require("./validation");
const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// ✅ Ensure Prisma is connected
prisma
  .$connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Brevo (Sendinblue) API Config
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/refferal", refferalValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, email, phone, refferCode, refferName } = req.body;

    // ✅ Convert phone and refferCode to strings (Important for PostgreSQL)
    phone = phone.toString();
    refferCode = refferCode.toString();

    const userExist = await prisma.refferal.findUnique({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Referral already done!" });
    }

    const newUser = await prisma.refferal.create({
      data: { name, email, phone, refferCode, refferName },
    });

    // ✅ Send Welcome Email
    const sendSmtpEmail = {
      to: [{ email, name }],
      sender: { email: "sumitrai3252@gmail.com", name: "Sumit Rai" },
      subject: "Welcome to Accerdian!",
      htmlContent: `<p>Hi ${name}, welcome to Accerdian! Our team will connect with you soon. Your Refer Code is ${refferCode}. You were referred by ${refferName}. In the meantime, you can explore your courses <a href="https://accredian.com/">here</a>.<br>
      Thank You.</p>`,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(201).json({ message: "Referral successful!", user: newUser });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Graceful Shutdown: Disconnect Prisma when app stops
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔴 Prisma disconnected");
  process.exit(0);
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
