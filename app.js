const express = require("express");
const app = express();
const port = 5000;

//static files(css,js)& middleware
app.use(express.static("./public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("dsd");
});

//fire routes
// app.use("/adoption", adoptionRoutes);

app.listen(port, () => console.log(`listen in : http://localhost:${port}`));
