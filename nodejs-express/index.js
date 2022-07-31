const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Archu@1809",
  database: "nodemysql",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql is connected");
});

app.post("/user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const pasword = req.body.pasword;
  db.query(
    "INSERT INTO user (name,email,phonenumber,pasword) VALUES (?,?,?,?)",
    [name, email, phonenumber, pasword],
    (err, result) => {
      if (err) throw err;
      return res.send({
        err: false,
        name: name,
        Id: result.insertId,
        message: "New user has been added successfully",
      });
    }
  );
});
app.post("/login", (req, res) => {
  const email = req.body.email;

  const pasword = req.body.pasword;
  db.query(
    "SELECT * FROM user WHERE email = ? AND pasword = ?",
    [email, pasword],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Wrong email and password combination" });
      }
    }
  );
});
app.post("/profile", (req, res) => {
  const dob = req.body.dob;
  const place_of_birth = req.body.place_of_birth;
  const height = req.body.height;
  const weight = req.body.weight;
  const color = req.body.color;
  const rasi = req.body.rasi;
  const nakshatram = req.body.nakshatram;
  const education = req.body.education;
  const profession = req.body.profession;
  const salary = req.body.salary;
  const user_id = 124;

  db.query(
    "INSERT INTO profile (dob,place_of_birth,height,weight,color,rasi,nakshatram,education,profession,salary,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [
      dob,
      place_of_birth,
      height,
      weight,
      color,
      rasi,
      nakshatram,
      education,
      profession,
      salary,
      user_id,
    ],
    (err, result) => {
      if (err) throw err;
      return res.send({
        err: false,
        Id: result.insertId,
        message: "Profile details are added",
      });
    }
  );
});
app.get("/home", (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;

  const offset = (page - 1) * limit;
  var sql = "SELECT COUNT(*) AS nameCount  FROM profile";
  db.query(
    "SELECT user.name, profile.user_id,profile.profileId,profile.place_of_birth,profile.dob,profile.height,profile.weight,profile.color,profile.rasi,profile.nakshatram,profile.education,profile.profession,profile.salary FROM user INNER JOIN profile ON user.user_id=profile.user_id limit  " +
      limit +
      " OFFSET " +
      offset,
    ("SELECT COUNT(*)   FROM profile",
    (err, result, rows) => {
      if (err) throw err;

      return res.send({ err: false, data: result, row: rows.length });
    })
  );
});

app.listen("8000", () => {
  console.log("server started on 8000");
});
