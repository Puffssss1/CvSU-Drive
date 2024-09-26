import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import connect from '@/lib/db';
import users from '@/lib/modals/user';

type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
};

export const authOptions = {
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
                const result = { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                } as UserType;
                // Return user object, ensuring it matches the UserType
                return result; 
            } catch (error) {
                console.log("Error: ", error);
                return null; 
            }
            }
        }),
    ],
    session: {
        strategy: "jwt" as const ,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};