import Sequelize from 'sequelize';
import sequelize from './sequelize';

class Users {

  constructor() {
    this.db = sequelize.define('user', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      socialType: Sequelize.STRING,
      socialId: Sequelize.STRING,
      name: Sequelize.STRING,
      photo: Sequelize.STRING
    }, {
      freezeTableName: true,
      timestamps: false
    });
    this.db.sync();
  }

  getUserById(id) {
    return this.db.findById(id).then((res) =>
      res && res.get()
    );
  }

  getUserByLocal(username, password) {
    const where = { username };
    if (password !== undefined) {
      where.$or = [
        { password: null },
        { password }
      ];
    }

    return this.db.findOne({ where }).then((res) =>
      res && res.get()
    );
  }

  getUserBySocial(socialType, socialId) {
    return this.db.findAll({
      where: {
        socialType, socialId
      }
    }).then((res) =>
      res && res.get()
    );
  }

  setLocalUser(username, password) {
    return this.getUserByLocal(username).then((user) => {
      return user ? false : this.db.create({ username, password, name: username }).then((res) =>
        res && res.get()
      );
    });
  }

  setSocialUser(socialType, socialId, name, photo) {
    return this.getUserBySocial(socialType, socialId).then((user) => {
      return user ? false : this.db.create({ socialType, socialId, name, photo }).then((res) =>
        res && res.get()
      )
    });
  }

}

export default new Users();
