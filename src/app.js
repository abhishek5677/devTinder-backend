const express = require("express");

const app = express();

app.use("/get", (req, res) => {
  res.send("your get data");
});
app.use("/post", (req, res) => {
  res.send("your post data");
});

app.use((req, res) => {
  res.send("Hello from the Express server!");
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
