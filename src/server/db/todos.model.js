import Sequelize from 'sequelize';
import sequelize from './sequelize';

class Todos {

  constructor() {
    this.db = sequelize.define('todo', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: Sequelize.INTEGER,
      text: Sequelize.STRING,
      completed: Sequelize.BOOLEAN
    }, {
      freezeTableName: true,
      timestamps: false
    });
    this.db.sync();
  }

  async add(userId, text, completed) {
    const res = await this.db.create({ userId: userId || null, text, completed });
    return res.get();
  }

  async mark(userId, todoId, completed) {
    await this.db.update({ completed }, {
      where: { id: todoId, userId: userId || null }
    });
    const res = await this.db.findById(todoId);
    return res.get();
  }

  async del(userId, todoId) {
    await this.db.destroy({
      where: { id: todoId, userId: userId || null }
    });
    return ({ id: todoId });
  }

  async getAll(userId) {
    const res = await this.db.findAll({
      where: { userId: userId || null }
    });
    return res.map(r => r.get());
  }
}

export default new Todos();
