import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        id: string; // Add user ID to the session
        role: string; // Add user role to the session
        user: {
            id: string; // User ID
            name: string; // User name
            email: string; // User email
            role: string; // User role
            department: string;
            contact: string;
            sex: string;
        };
    }

    interface User {
        id: string; // User ID
        name: string; // User name
        email: string; // User email
        role: string; // User role
        department: string;
        contact: string;
        sex: string;
    }

    interface JWT {
        id: string; // Add user ID to the JWT
        role: string; // Add user role to the JWT
        department?: string;
        contact?: string;
        sex?: string;
    }
}
