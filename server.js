const express = require('express');
const bodyParser = require('body-parser');
const readline = require('readline');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001;

app.get('/', (req, res) => res.sendFile(__dirname + '/src/index.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/src/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/src/register.html'));

// get username and password from the request and login
app.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    // check from mydb.txt and login if account exists
    const myDB = fs.readFileSync('myDB.txt', 'utf-8');
    myDB.split(/\r?\n/).forEach(line => {
        console.log(`Line from file: ${line}`);
        if (line.split(',')[0] == username && line.split(',')[1] == password) {
            login = true;
            res.json({ msg: 'Login successful' });
            console.log("login success");
            return;
        }
    });
    res.json({ msg: 'Account does\'t exists' });
    console.log("login failed ");
});
// get username and password from the request and register
app.post('/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    // append to mydb.txt
    const myDB = fs.readFileSync('myDB.txt', 'utf-8');
    myDB.split(/\r?\n/).forEach(line => {
        console.log(`Line from file: ${line}`);
        if (line.split(',')[0] == username && line.split(',')[1] == password) {
            res.json({ msg: 'Account already exists' });
            console.log("register failed");
            return;
        }
    });


    fs.open(__dirname+'myDB.txt', 'w', function (err, file) {

        if (err) throw err;
        fs.appendFile(__dirname+'myDB.txt', username + ',' + password + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
            return res.json({ msg: 'Account created successfully' });
        });
    });
});

app.listen(port, () => console.log(`App listening on port http://localhost:${port}`));