import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import User from "@/models/User.model";
import { dbConnect } from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/dto/signIn.dto";
import type { Provider } from "next-auth/providers";
const saltRounds = process.env.SALT_ROUNDS || 10;

// This is an array of all the Sign In Providers. We are only using the Credentials provider
const providers: Provider[] = [
  Credentials({
    id: "credentials",
    name: "Credentials",
    credentials: {
      username: {
        label: "Username",
        type: "text",
        placeholder: "Enter your username"
      },
      password: {
        label: "Password",
        type: "password",
        placeholder: "Enter your password"
      }
    },
    authorize: async (credentials) => {
      let user = null;
      console.log(credentials);

      // If the credentials are not provided, throw an error
      if (!credentials || !credentials.username || !credentials.password) {
        throw new CredentialsSignin("Credentials not provided");
      }

      try {
        // Connect to the database
        dbConnect();

        // Extract the username and password from the credentials after parsing it through Zod
        const { username, password } =
          await signInSchema.parseAsync(credentials);

        // Fetch the user where the username or the password field matches the given username
        const fetchedUser = await User.findOne({
          $or: [{ username: username }, { email: username }]
        });

        console.log(fetchedUser);

        // If there is no fetchedUser, throw an error
        if (!fetchedUser) {
          throw new CredentialsSignin("No User Found.");
        }

        // Compare the entered password with the fetched password
        const doesPasswordMatch = await bcrypt.compare(
          password,
          fetchedUser.password
        );

        // If the passwords don't match, throw an error
        if (!doesPasswordMatch) {
          throw new CredentialsSignin("Invalid password");
        }

        // If the fetchedUser is not verified, throw an error
        if (!fetchedUser.isVerified) {
          throw new CredentialsSignin(
            "User not verified. Please verify your email address."
          );
        }

        // If the user clears all these tests. return the fetchedUser
        user = fetchedUser;
      } catch (err) {
        console.log(err);
        throw new CredentialsSignin("Something went wrong.");
      }

      // return user object with the their profile data
      return user;
    }
  })
];

// Create an array of names and ids of all the providers called providerMap
export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/sign-in"
  },
  callbacks: {
    // This function will run every time a new JWT is to be created (ie. log in, refresh token etc.)
    async jwt({ token, user }) {
      // Structure of the Auth objects set in "auth.d.ts"
      if (user) {
        token._id = user._id.toString();
        token.fullName = user.fullName;
        token.username = user.username;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    // This function will run every time a new session is to be created
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
      }
      return session;
    }
  }
});
