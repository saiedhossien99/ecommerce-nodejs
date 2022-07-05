const express = require('express');
const bodyparser = require("body-parser");
const db = require("./modules/db");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

app.use('/auth', require('./modules/router'));

app.use((req,res)=>{
    return res.status(400).json({
        massage:'endpoint not found'
    });
})


app.get("/", (req, res) => {
    db.query('select * from user', (err, row) => {
        if (err) throw err;
        res.send(row);
    })
})

app.listen(3006, () => {
    console.log('the server is running on port 3006');
})