import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { User } from "./models/user";
import { connectToDB } from "./utils/connectToDB";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("no user please provide all the field");
        }
        const { username, password } = credentials;
        await connectToDB();

        const user = await User.findOne({ username }).select("+password");
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
          throw new Error("Invalid Password");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 24 * 60 * 60, // 15 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = token || {}; // Initialize token object if it's undefined
        token.id = user._id.toString();
        // Exclude the password field from the user object
        const { password, ...rest } = user.toObject();
        token.user = rest;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.user.id = token.id;
      }
      return session;
    },
  },
});
