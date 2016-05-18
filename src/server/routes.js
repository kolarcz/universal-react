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
    successFlash: 'Logged in',
    failureRedirect: '/login',
    failureFlash: 'Username already exists'
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
    successFlash: 'Logged in',
    failureRedirect: '/login',
    failureFlash: 'Wrong username or password'
  }));


  if (CONFIG.SOCIAL_FACEBOOK_ID) {
    passport.use(new FacebookStrategy({
      clientID: CONFIG.SOCIAL_FACEBOOK_ID,
      clientSecret: CONFIG.SOCIAL_FACEBOOK_SECRET,
      callbackURL: CONFIG.SOCIAL_FACEBOOK_CALLBACK
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


  initialized = true;
}

export default function (CONFIG) {
  if (!initialized) {
    initialize(CONFIG);
  }
  return app;
}
