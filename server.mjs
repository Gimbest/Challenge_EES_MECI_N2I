import express from "express";
import fs from "fs";
import bcrypt from "bcrypt";
import path from "path"

const app = express();
const port = 4000;
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const USERS_FILE = "./users.json";

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function loadHTML(filename="", message = "") {
  if(filename === "")return;
  let html = fs.readFileSync(path.join('.', filename), 'utf8');
  // Injecter le message dans une div prévue pour ça
  html = html.replace('<!-- ERROR_MESSAGE -->', `<p class="error">${message}</p>`);
  return html;
}


app.post("/submit", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send(loadHTML("src/sign_in.html","Veuillez remplir tous les champs"));
  }

  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.send(loadHTML("src/sign_in.html", "Cet utilisateur existe déjà"));
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    username,
    password: hashedPassword, 
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  res.redirect("/index.html");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }


  const users = loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) 
  {
    res.send(loadHTML("src/register.html", "Erreur d'utilisateur ou de mot de passe"));
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) 
  {
    res.send(loadHTML("src/register.html", "Erreur d'utilisateur ou de mot de passe"));
    return;
  }

  res.redirect(`src/welcome.html?username=${encodeURIComponent(username)}`);
});

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));