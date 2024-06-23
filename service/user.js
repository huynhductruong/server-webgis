import User from "../models/user.js"

const getAllUser = async () => {
    try {
        const users = await User.findAll()
        return users
    } catch (error) {
        throw error
    }

}
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        return user
    } catch (error) {
        throw error
    }

}
export default {
    getAllUser,
    getUserByEmail
}