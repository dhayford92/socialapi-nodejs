import { Sequelize } from "sequelize";


export const sequelize = new Sequelize('social_db', 'root', '9723impw', {
    host: 'localhost',
    dialect: 'mysql',
  });


export const connectDb = async () => {
    try{
        await sequelize.authenticate();
        console.log("Successfully connected to database");
    }
    catch(err){
        console.log("Error connecting to database");
    }
};