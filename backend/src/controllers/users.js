import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import status from "http-status";
import crypto from "crypto";


const getCurrentUser = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const user = await User.findOne({token});
        
        if(!user) {
            return res.status(status.UNAUTHORIZED).json({message: "unauthorized"});
        }
        res.status(status.OK).json({
            user: {
                id: user._id,
                name: user.name,
                username: user.username
            }
        });
    }catch(e) {
        res.status(500).json({message: "Somthing went wrong!"});
    }
}

const login = async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message:"Please Provide!"});
    }

    try{
        const user = await User.findOne({username});
        if(!user) {
            return res.status(status.NOT_FOUND).json({message: "User Not Found"});
        }
        const isCorrectPassward = await bcrypt.compare(password, user.password);
        if(!isCorrectPassward) {
            return res.status(401).json({message: "Invalid username or passward"});
        }
        if(isCorrectPassward) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            res.status(status.OK).json({
                message : "User Successfully Logged In!",
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username
                }
            });
        }
    }catch(e) {
        res.status(500).json({message: "Something went wrong"});
    }
}

const register = async (req, res) => {
    const {username, password, name} = req.body;

    try {
        const isUserExists = await User.findOne({username});
        if(isUserExists){
            return res.status(status.FOUND).json({message : "user already exists!"});
        }
        const hashedPassword = await bcrypt.hash(password, 10); //early return statements : concept in good codes
        const newUser = new User({
            name : name,
            username : username,
            password : hashedPassword,
        });
        await newUser.save();
        res.status(status.CREATED).json({message : "User successfully registered"});

    }catch(e) {
        res.status(500).json(`Something went wrong ${e}`);
    }
}
export {login, register, getCurrentUser};