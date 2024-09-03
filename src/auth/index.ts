import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Google],
	callbacks: {
		async signIn({ account, user }) {
			if (!account || !user) {
				return false;
			}

			if (
				account.provider === "google" &&
				user.email === "votrungquan99@gmail.com"
			) {
				return true;
			}

			return false;
		},
	},
});
