import Sequelize from 'sequelize';
import sequelize from './sequelize';

class Users {

  constructor() {
    this.userAttribs = [
      'id', 'username', 'socialType', 'socialId', 'name', 'photo'
    ];

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

  async getUserById(id) {
    const res = await this.db.findById(id, { attributes: this.userAttribs });
    return res && res.get();
  }

  async getUserByLocal(username, password) {
    const where = { username };
    if (password !== undefined) {
      where.$or = [
        { password: null },
        { password }
      ];
    }

    const res = await this.db.findOne({
      where,
      attributes: this.userAttribs
    });
    return res && res.get();
  }

  async getUserBySocial(socialType, socialId) {
    const res = await this.db.findOne({
      where: { socialType, socialId },
      attributes: this.userAttribs
    });
    return res && res.get();
  }

  async setLocalUser(username, password) {
    const user = await this.getUserByLocal(username);
    if (user) return false;

    const res = await this.db.create(
      { username, password, name: username },
      { attributes: this.userAttribs }
    );
    return res && res.get();
  }

  async setSocialUser(socialType, socialId, name, photo) {
    const user = await this.getUserBySocial(socialType, socialId);
    if (user) return false;

    const res = await this.db.create(
      { socialType, socialId, name, photo },
      { attributes: this.userAttribs }
    );
    return res && res.get();
  }

}

export default new Users();
