import { userService } from "../service/index.js";

const login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await userService.getUserByEmail(email)
        if(user.password === password) res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            message: "ERROR"
        })
    }
};
const getAllUser = async (req, res) => {
    try {
        const users = await userService.getAllUser()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message: "ERROR"
        })
    }
};
const getUserByEmail = async (req, res) => {

};


export default {
    login,
    getAllUser,
    getUserByEmail
};