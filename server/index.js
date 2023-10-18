import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* CLOUDINARY CONFIGURATION */
cloudinary.config({
    cloud_name: 'djvpgim4w',
    api_key: '238442638351457',
    api_secret: 'xqr6JiZ_3Tb5umLBSa4hIayJQ0k'
});

// Adjust the file filter for audio, image, and document uploads
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only audio, image, and document files are allowed."), false);
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        public_id: (req, file) => {
            const uniquePrefix = Date.now().toString();
            const randomString = Math.random().toString(36).substring(2, 7);
            return `${uniquePrefix}_${randomString}`;
        },
    },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("file"), register);
app.post("/posts", verifyToken, upload.single("file"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));