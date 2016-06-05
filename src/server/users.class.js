class Users {

  constructor() {
    this.users = [];
  }

  getUserById(id) {
    return this.users.find(user => user.id === parseInt(id, 10));
  }

  getUserByLocal(username, password) {
    return this.users.find((user) =>
      user.username === username && (typeof password === 'undefined' || user.password === password)
    );
  }

  getUserBySocial(socialType, socialId) {
    return this.users.find((user) =>
      user.socialType === socialType && user.socialId === socialId
    );
  }

  setLocalUser(username, password) {
    if (this.getUserByLocal(username)) {
      return false;
    }

    const newUser = { id: this.users.length, username, password, name: username };
    this.users.push(newUser);
    return newUser;
  }

  setSocialUser(socialType, socialId, name, photo) {
    if (this.getUserBySocial(socialType, socialId)) {
      return false;
    }

    const newUser = { id: this.users.length, socialType, socialId, name, photo };
    this.users.push(newUser);
    return newUser;
  }

}

export default new Users;
