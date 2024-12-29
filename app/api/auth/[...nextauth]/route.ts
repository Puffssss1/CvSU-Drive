import NextAuth, { NextAuthOptions, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connect from '@/lib/db';
import users from '@/lib/modals/user';
import { JWT } from 'next-auth/jwt';

type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
    contact: string;
    sex: string;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            authorize: async (credentials) => {
                if (!credentials) return null; 

                const { email, password } = credentials as Record<string, string>;

                try {
                    await connect();
                    const user = await users.findOne({ email });

                    if (!user) {
                        return null; 
                    }

                    if (user.password !== password) {
                        return null;
                    }

                    const result: UserType = { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        password: user.password,
                        role: user.role,
                        department: user.department,
                        contact: user.contact,
                        sex: user.sex,
                    };

                    // Return user object
                    return result; 
                } catch (error) {
                    console.log("Error: ", error);
                    return null; 
                }
            }
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;  
                token.role = user.role; 
                token.department = user.department; // Include department
                token.contact = user.contact;       // Include contact
                token.sex = user.sex; 
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token) {
                session.id = token.id as string;
                session.role = token.role as string;
                session.user = {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    department: token.department, // Map department
                    contact: token.contact,       // Map contact
                    sex: token.sex,               // Map sex
                };
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
