import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

async function foodHub() {
  try {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

foodHub();