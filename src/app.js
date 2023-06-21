import express, { json } from "express";

let USERS = [];
let TWEETS = [];

const app = express();

app.use(json());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (!username || !avatar) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  if (typeof username != "string" || typeof avatar != "string") {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  USERS.push({ username, avatar });
  res.status(200).send("OK");
});

app.listen(5000, () => {
  console.log("👾 Servidor no ar! Porta 5000! 👾");
});
