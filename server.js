const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());

app.use("/api", userRoutes);

const port = 4550;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
