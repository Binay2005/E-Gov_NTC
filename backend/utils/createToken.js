import jwt from "jsonwebtoken";

const createToken = (_id, res) => {
    const token = jwt.sign({_id},    "mysecretkey",{
        expiresIn: "3d",

    })
    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,//converting 3 days into miliseconds
    });
};

export default createToken;