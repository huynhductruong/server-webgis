import { Sequelize } from 'sequelize'
const DB = new Sequelize('webgis', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging:false
  })
export default DB
