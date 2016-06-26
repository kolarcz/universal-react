import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import users from './db/users.model';
import todos from './db/todos.model';


export default function (CONFIG, sockets) {
  const app = express.Router(); // eslint-disable-line new-cap

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    users.getUserById(id).then(user => done(null, user));
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    req.user = req.user || {};
    res.emitToUser = (userId, ...args) => {
      Object.keys(sockets.sockets.connected).forEach(key => {
        const socket = sockets.sockets.connected[key];
        const socketUserId = socket.request.user && socket.request.user.id;
        if (socketUserId === userId) {
          socket.emit(...args);
        }
      });
    };
    res.emitToAll = (...args) => {
      Object.keys(sockets.sockets.connected).forEach(key => {
        sockets.sockets.connected[key].emit(...args);
      });
    };
    next();
  });

  const passInit = passport.initialize();
  const passSess = passport.session();
  sockets.use(({ request }, next) => passInit(request, {}, next));
  sockets.use(({ request }, next) => passSess(request, {}, next));


  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const user = await users.setLocalUser(username, password);
    done(null, user);
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    successFlash: 'Logged in',
    failureRedirect: '/login',
    failureFlash: 'Username already exists'
  }));


  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const user = await users.getUserByLocal(username, password);
    done(null, user);
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    successFlash: 'Logged in',
    failureRedirect: '/login',
    failureFlash: 'Wrong username or password'
  }));


  if (CONFIG.SOCIAL_FACEBOOK_ID) {
    passport.use(new FacebookStrategy({
      clientID: CONFIG.SOCIAL_FACEBOOK_ID,
      clientSecret: CONFIG.SOCIAL_FACEBOOK_SECRET,
      callbackURL: CONFIG.SOCIAL_FACEBOOK_CALLBACK
    }, async (token, refreshToken, profile, done) => {
      const user = await users.getUserBySocial('facebook', profile.id);
      if (user) {
        done(null, user);
      } else {
        const user = await users.setSocialUser('facebook', profile.id,
          profile.displayName,
          `https://graph.facebook.com/${profile.id}/picture`
        );
        done(null, user);
      }
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/',
      successFlash: 'Logged in',
      failureRedirect: '/login',
      failureFlash: 'Something wrong with login via Facebook'
    }));
  }

  if (CONFIG.SOCIAL_GOOGLE_ID) {
    passport.use('google', new GoogleStrategy({
      clientID: CONFIG.SOCIAL_GOOGLE_ID,
      clientSecret: CONFIG.SOCIAL_GOOGLE_SECRET,
      callbackURL: CONFIG.SOCIAL_GOOGLE_CALLBACK
    }, async (token, refreshToken, profile, done) => {
      const user = await users.getUserBySocial('google', profile.id);
      if (user) {
        done(null, user);
      } else {
        const user = await users.setSocialUser('google', profile.id,
          profile.displayName,
          profile.photos[0].value
        );
        done(null, user);
      }
    }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      successFlash: 'Logged in',
      failureRedirect: '/login',
      failureFlash: 'Something wrong with login via Google'
    }));
  }


  app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out');
    res.redirect('/');
  });


  app.get('/getAllTodos', async (req, res) => {
    const todosList = await todos.getAll(req.user.id);
    const resTodos = {};
    todosList.forEach((todo) => {
      resTodos[todo.id] = todo;
    });
    res.json(resTodos);
  });

  app.post('/addTodo', async (req, res) => {
    const todo = await todos.add(req.user.id, req.body.text, false);
    res.json(todo);
    res.emitToUser(req.user.id, 'addTodo', todo.id, todo.text, todo.done);
  });

  app.post('/markTodo', async (req, res) => {
    const todo = await todos.mark(req.user.id, req.body.id, req.body.done);
    res.json(todo);
    res.emitToUser(req.user.id, 'markTodo', todo.id, todo.text, todo.done);
  });

  app.post('/delTodo', async (req, res) => {
    const todo = await todos.del(req.user.id, req.body.id);
    res.json(todo);
    res.emitToUser(req.user.id, 'deleteTodo', todo.id);
  });


  return app;
}
