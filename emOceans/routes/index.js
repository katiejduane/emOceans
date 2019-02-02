var express = require('express');
var router = express.Router();

const config = require('../config');

var bcrypt = require('bcrypt-nodejs');

var mysql = require('mysql');
let connection = mysql.createConnection(config.db);
connection.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect('/splash?msg=mustLogIn')
  } else {
    let msg;
    if (req.query.msg == 'regSuccess') {
      msg = "You're all signed up! Click on a color below that resemebles you you've felt today, add a mood, a note, if you like, and click save!";
      console.log(msg)
    } else if (req.query.msg == 'loginSuccess') {
      msg = "You're logged in."
    }
    res.render('index')
  }
});

router.get('/splash', (req, res, next) => {
  res.render('splash')
})

router.get("/login", (req, res, next) => {
  res.render("login");
})

// loginProcess
router.post('/loginProcess', (req, res, next) => {
  // res.json(req.body)
})

router.get("/register", (req, res, next) => {
  let msg;
  if (req.query.mes == 'registered') {
    msg = 'This email address is already registered.'
  }
  res.render("register", {
    msg
  });
})
 
// registerProcess
router.post('/registerProcess', (req, res, next) => {
  const hashedPass = bcrypt.hashSync(req.body.password);
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [req.body.email], (error, results) => {
    if(error){throw error}
    console.log("results",results);
    if (results.length != 0) {
      res.redirect('/register?msg=registered')
    }else{
      const insertQuery = `INSERT INTO users (firstName, lastName, email, hash, phone)
      VALUES 
      (?,?,?,?,?)`;
      connection.query(insertQuery, [req.body.firstName,req.body.lastName, req.body.email, hashedPass, req.body.phone], (error2, results2) => {
        if(error2) {throw error2}
        res.redirect('/?msg=regSuccess')
      })
    }
  })
  // res.json(req.body)
})

router.get("/create", (req, res, next) => {
  res.render("create");
})

router.post("/addMood", (req, res, next) => {
  
  // res.json(req.body)
})
//above function will also res.redirect to /moodBoards when it's working!

router.get("/moodBoards", (req, res, next) => {
  res.render("create");
})


router.get('/logout', (req, res, next) => {
  // delete all session variables for this user
  req.session.destroy();
  res.redirect('/login?msg=loggedOut')
})

module.exports = router;