import
import users from './db/users.model';
import todos from './db/todos.model';

const users = new Users(sequelize);
const todos = new Todos(sequelize);

const isReady = sequelize.sync();

export {
  users, todos, isReady
};
