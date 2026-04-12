import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        // This ensures the URL is HTTPS and asks Google for a 256px version (=s256)
        const userImage = profile.picture?.replace("http://", "https://");
        
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: userImage ? `${userImage.split('=')[0]}=s256` : null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Check if this is the very first user in the system OR the designated super admin
          const userCount = await User.countDocuments();
          const isSuperAdmin = user.email === 'ashishchauhan4636@gmail.com';
          const role = (userCount === 0 || isSuperAdmin) ? "ADMIN" : "VIEWER";
          
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: user.id || profile?.sub,
            role: role
          });
        } else {
          // If the super admin already exists but isn't an admin, promote them
          if (user.email === 'ashishchauhan4636@gmail.com' && existingUser.role !== 'ADMIN') {
            existingUser.role = 'ADMIN';
          }
          // Update last login
          existingUser.lastLogin = new Date();
          await existingUser.save();
        }
        return true;
      } catch (error) {
        console.error("SignIn Callback Error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        
        // Fetch role from DB and attach to session
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            (session.user as any).role = dbUser.role;
          }
        } catch (error) {
          console.error("Session Callback Error:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // On initial sign in, user object is available
      if (user) {
        token.sub = user.id;
      }
      
      // Always fetch the latest role from the database to ensure middleware is up to date
      try {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
      }
      
      return token;
    },
  },
});

export { handler as GET, handler as POST };