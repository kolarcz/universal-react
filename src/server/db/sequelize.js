import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE, {
  logging: __DEV__ && console.log
});
