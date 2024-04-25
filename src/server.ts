import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const HOST: string = process.env.HOST || "localhost";
const PORT: number =
  process.env.PORT === undefined ? 8080 : Number(process.env.PORT);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
