import { app } from "./app.js";
import colors from "colors";
import { connectDB } from "./data/database.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(
    `Server listening on PORT : ${process.env.PORT}, in ${process.env.NODE_ENV} MODE`
      .rainbow
  );
});
