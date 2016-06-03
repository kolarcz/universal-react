import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import Users from './users.class.js';
const users = new Users();

const app = express.Router(); // eslint-disable-line new-cap

let initialized = false;

function initialize(CONFIG) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, users.getUserById(id) || false));

  app.use(passport.initialize());
  app.use(passport.session());


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


  initialized = true;
}

export default function (CONFIG) {
  if (!initialized) {
    initialize(CONFIG);
  }
  return app;
}
