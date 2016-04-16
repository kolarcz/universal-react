import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

const app = express.Router(); // eslint-disable-line new-cap

const users = [];
let initialized = false;

function initialize(CONFIG) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, users[id] || false));

  app.use(passport.initialize());
  app.use(passport.session());


  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, done) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username || !password.length) {
        return done(null, false);
      }
    }
    const newUser = { username, password, name: username };
    users.push(newUser);
    return done(null, { ...newUser, id: users.length - 1 });
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));


  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, done) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        return done(null, { ...users[i], id: i });
      }
    }
    return done(null, false);
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));


  if (CONFIG.social.facebook.clientId) {
    passport.use(new FacebookStrategy({
      clientID: CONFIG.social.facebook.clientId,
      clientSecret: CONFIG.social.facebook.clientSecret,
      callbackURL: CONFIG.social.facebook.callbackUrl
    }, (token, refreshToken, profile, done) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].social === 'facebook' && users[i].socialId === profile.id) {
          return done(null, { ...users[i], id: i });
        }
      }
      const newUser = {
        social: 'facebook',
        socialId: profile.id,
        name: profile.displayName,
        photo: `https://graph.facebook.com/${profile.id}/picture`
      };
      users.push(newUser);
      return done(null, { ...newUser, id: users.length - 1 });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));
  }

  if (CONFIG.social.google.clientId) {
    passport.use('google', new GoogleStrategy({
      clientID: CONFIG.social.google.clientId,
      clientSecret: CONFIG.social.google.clientSecret,
      callbackURL: CONFIG.social.google.callbackUrl
    }, (token, refreshToken, profile, done) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].social === 'google' && users[i].socialId === profile.id) {
          return done(null, { ...users[i], id: i });
        }
      }
      const newUser = {
        social: 'google',
        socialId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      };
      users.push(newUser);
      return done(null, { ...newUser, id: users.length - 1 });
    }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));
  }


  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/userInfo', (req, res) => {
    res.json(req.user || {});
  });


  initialized = true;
}

export default function (CONFIG) {
  if (!initialized) {
    initialize(CONFIG);
  }
  return app;
}
