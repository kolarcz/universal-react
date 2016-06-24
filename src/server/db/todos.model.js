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
      done: Sequelize.BOOLEAN
    }, {
      freezeTableName: true,
      timestamps: false
    });
    this.db.sync();
  }

  add(userId, text, done) {
    return this.db.create({ userId: userId || null, text, done }).then((res) =>
      res.get()
    );
  }

  mark(userId, todoId, done) {
    return this.db.update({ done }, {
      where: { id: todoId, userId: userId || null }
    }).then(() =>
      this.db.findById(todoId)
    ).then((res) =>
      res.get()
    );
  }

  del(userId, todoId) {
    return this.db.destroy({
      where: { id: todoId, userId: userId || null }
    }).then(() =>
      ({ id: todoId })
    );
  }

  getAll(userId) {
    return this.db.findAll({
      where: { userId: userId || null }
    }).then((res) =>
      res.map(r => r.get())
    );
  }
}

export default new Todos();
