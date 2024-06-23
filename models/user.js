import DB from "../config/index.js";
import { Model, DataTypes } from 'sequelize'
class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    role: DataTypes.STRING
}, {
    sequelize: DB,
    timestamps: false,
    modelName: 'User',
    tableName: 'user'
})

export default User
