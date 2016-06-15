import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import users from './users.class.js';
import todos from './todos.class.js';

export default function (CONFIG, sockets) {
  const app = express.Router(); // eslint-disable-line new-cap

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, users.getUserById(id)));

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
  }, (req, username, password, done) =>
    done(null, users.setLocalUser(username, password))
  ));

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
  }, (req, username, password, done) =>
    done(null, users.getUserByLocal(username, password))
  ));

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
    }, (token, refreshToken, profile, done) =>
      done(
        null,
        users.getUserBySocial('facebook', profile.id) ||
        users.setSocialUser('facebook', profile.id,
          profile.displayName,
          `https://graph.facebook.com/${profile.id}/picture`
        )
      )
    ));

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
    }, (token, refreshToken, profile, done) =>
      done(
        null,
        users.getUserBySocial('google', profile.id) ||
        users.setSocialUser('google', profile.id,
          profile.displayName,
          profile.photos[0].value
        )
      )
    ));

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


  app.get('/getAllTodos', (req, res) => {
    res.json(todos.getAll(req.user.id));
  });

  app.post('/addTodo', (req, res) => {
    const newTodo = todos.add(req.user.id, req.body.text, false);
    res.json(newTodo);
    res.emitToUser(req.user.id, 'addTodo', newTodo.id, newTodo.text, newTodo.done);
  });

  app.post('/markTodo', (req, res) => {
    const markedTodo = todos.mark(req.user.id, req.body.id, req.body.done);
    res.json(markedTodo);
    res.emitToUser(req.user.id, 'markTodo', markedTodo.id, markedTodo.text, markedTodo.done);
  });

  app.post('/delTodo', (req, res) => {
    const deletedTodo = todos.del(req.user.id, req.body.id);
    res.json(deletedTodo);
    res.emitToUser(req.user.id, 'deleteTodo', deletedTodo.id);
  });


  return app;
}
