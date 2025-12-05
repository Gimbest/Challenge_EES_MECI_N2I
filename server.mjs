import express from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

app.post("/submit", (req, res) => {
  console.log("Formulaire reçu :", req.body);
  res.json({ message: `Bonjour ${req.body.username}, formulaire reçu !` });
});

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));