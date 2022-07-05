const express=require('express');
const router=express.Router();
const db=require('./db');
const jwt=require('jsonwebtoken');
const {check,validationResult}=require('express-validator');



router.post(
    "/login", [
        check("email", "email is required").isEmail(),
        check("password", "Enter a password with 6 or more length").isLength({
            min: 6,
        }),
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array(),
            });
        }
        let query = `select * from user where email = '${req.body.email}' and password = '${req.body.password}'`;
        
        db.query(query,
            (error, result) => {
                if (error) {
                    console.log(error);
                }
               
                if (result.length > 0) {
                    const payload = {
                        email: result.email,
                        user_name: result.user_name,
                    };

                    jwt.sign(
                        payload,
                        "DIIT18thBatchB&C", {
                            expiresIn: 360000,
                        },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token: token,
                            });
                        }
                    );
                } else {
                    return res.status(403).json({
                        message: "Unauthorized access!",
                    });
                }
            }
        );
    }
)



router.post("/signup", [
    check('name', 'name is required').isLength({ min: 2 }),
    check('email', 'email is required').isEmail(),
    check('address', 'address is required').isLength({ min: 3 }),
    check('password', 'password must be longer than 5 digit').isLength({ min: 6 })
], (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array(),
        });
    }
    const progms = req.body;
    const command = 'insert into user set ?';

    db.query(command, progms, (err, result) => {
        if (err) {
            return res.status(400).json({
                massage: err.sqlMessage,
            });
        }
        if (result) {
            return res.json({
                message: "user registration is successful!!"
            })
        } else {
            return res.status(400).json({
                message: "unable to create user",
            });
        }
    })

})
module.exports=router;