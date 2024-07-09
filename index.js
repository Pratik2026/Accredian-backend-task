import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import referralRoutes from "./src/routes/referralRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", referralRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
