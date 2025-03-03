import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import expenseRoute from "./routes/expenseRoute.js";
import budgetRoute from "./routes/budgetRoute.js";
import categoryRoute from "./routes/categoryRoute.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;

mongoose.connect(URL)
    .then(() => console.log("DB connected successfully"))
    .catch(error => console.log(error));

app.use("/api/users", userRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/budgets", budgetRoute);
app.use("/api/categories", categoryRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
