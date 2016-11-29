import sequelize from './sequelize';

import users from './users.model';
import todos from './todos.model';

const isReady = sequelize.sync();

export {
  users, todos, isReady
};
