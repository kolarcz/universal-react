class Todos {

  constructor() {
    this.todos = {};
    this.lastIds = {};
  }

  add(userId, text, isDone) {
    const todos = this.getAll(userId);

    this.lastIds[userId] = this.lastIds[userId] || 0;

    const newTodo = {
      id: this.lastIds[userId]++,
      text,
      done: isDone
    };

    todos[newTodo.id] = newTodo;
    return newTodo;
  }

  mark(userId, todoId, isDone) {
    const todos = this.getAll(userId);

    if (todos[todoId]) {
      todos[todoId].done = isDone;
    }

    return todos[todoId];
  }

  del(userId, todoId) {
    const todos = this.getAll(userId);
    delete todos[todoId];
    return { id: todoId };
  }

  getAll(userId) {
    const todos = this.todos[userId] = this.todos[userId] || {};
    return todos;
  }

}

export default new Todos;
