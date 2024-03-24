import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoggleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import FacebookProvider, { type FacebookProfile } from 'next-auth/providers/facebook'
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github'
import { PrismaAdapter } from "@next-auth/prisma-adapter"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/config/options
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/singIn",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    redirect: ({ baseUrl }) => {
      return baseUrl
    },
    jwt: ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: ({ session,token,user }) => {
      if(user){
        session.user.id = user.id
      }
  
      return {...session,...token}        
    },
  },
  // adapter: PrismaAdapter(db),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [
    GithubProvider({
      clientId:process.env.GITHUB_CLIENT_ID!,
      clientSecret:process.env.GITHUB_CLIENT_SECRET!,
      httpOptions:{
        timeout:20000,
      },
      profile(profile:GithubProfile){
        console.log(profile)
        return {
          id: String(profile.id),
          name: profile.login.replace('-',' '),
          email: profile.email,
          image: profile.avatar_url,
          role:'client',
          isVerified:true,
          Client:{
            create:{
            }
          }
        }
      }
    }),
    GoggleProvider({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientId: process.env.GOOGLE_CLIENT_ID!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        profile(profile:GoogleProfile) {
          console.log(profile)
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role:'client',
            Client:{
              create:{
                isVerified:true,
                verifiedDate:new Date()
              }
            }
          }
        },    
      }),
      FacebookProvider({
        httpOptions:{
          timeout:20000,
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        profile(profile:FacebookProfile){
          return {
            id: profile.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            name: profile.name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            email: profile.email,
            image: profile.picture.data.url,
            role:'client',
            Client:{
              create:{
                isVerified:true,
                verifiedDate:new Date()
              }
            }
          }
        }
      })
    
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/config/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

