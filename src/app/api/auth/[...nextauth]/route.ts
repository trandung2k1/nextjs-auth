import NextAuth from 'next-auth';
import type { AuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'johnsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (credentials) {
                    const res = await fetch('https://dummyjson.com/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                            expiresInMins: 60, // optional
                        }),
                    }).then((res) => res.json());

                    if (res?.message) {
                        throw new Error('Login Failed');
                    }

                    if (res) {
                        return res;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            },
            // async authorize(credentials, req) {
            //     if (typeof credentials !== 'undefined') {
            //         const res = await authenticate(credentials.email, credentials.password);
            //         const token = '';
            //         if (typeof res !== 'undefined') {
            //             return { ...res.user, apiToken: res.token };
            //         } else {
            //             return null;
            //         }
            //     } else {
            //         return null;
            //     }
            // },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            const sessionInfo = {
                user: {
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    name: `${token.firstName} ${token.lastName}`,
                    image: token.image,
                },
                expires: session.expires,
                accessToken: token.token,
            };

            return sessionInfo as Session;
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                return { ...token, ...user };
            }
            return token;
        },
    },

    // session: { strategy: 'jwt' },
    // callbacks: {
    //     async session({ session, token, user }) {
    //         const sanitizedToken = Object.keys(token).reduce((p, c) => {
    //             // strip unnecessary properties
    //             if (c !== 'iat' && c !== 'exp' && c !== 'jti' && c !== 'apiToken') {
    //                 return { ...p, [c]: token[c] };
    //             } else {
    //                 return p;
    //             }
    //         }, {});
    //         return { ...session, user: sanitizedToken, apiToken: token.apiToken };
    //     },
    //     async jwt({ token, user, account, profile }) {
    //         if (typeof user !== 'undefined') {
    //             // user has just signed in so the user object is populated
    //             return user as unknown as JWT;
    //         }
    //         return token;
    //     },
    // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
