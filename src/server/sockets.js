import users from './users.class.js';

export default function (sockets) {
  sockets.on('connection', (socket) => {
    const user = users.getUserById(
      socket.request.session.passport && socket.request.session.passport.user
    );

    console.log('A socket connected! User:', user);
  });
}
