import passport from "passport";
import passportGoogle, { Profile } from "passport-google-oauth20";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;
const HOST = process.env.REDIRECT_HOST || "localhost";
const PORT = process.env.REDIRECT_PORT || "3000";
const callbackURL = `http://${HOST}:${PORT}/auth/google/callback`;

export interface User {
  id: string;
  displayName: string;
}

// replace this with proper database
const userCache: Map<string, User> = new Map<string, User>();

export function authSetup() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: callbackURL,
        passReqToCallback: true,
      },
      (
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function
      ) => {
        const user: User = { id: profile.id, displayName: profile.displayName };
        // not storing user into database for this example. using cache
        if (!userCache.has(profile.id)) {
          userCache.set(profile.id, user);
        }
        return done(null, user);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    const cast_user = user as User;
    done(null, cast_user.id);
  });

  passport.deserializeUser(function (id, done) {
    const user = userCache.get(id as string);
    done(null, user);
  });
}
