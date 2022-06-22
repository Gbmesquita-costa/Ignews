import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb"

import { faunadb } from "../../../services/fauna"

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "read:user"
                }
            }
        })
    ],
    secret: process.env.SIGNIN_KEY,
    callbacks: {
        async session({ session }) {
            try {
                const userActiveSubscription = await faunadb.query(
                    q.Get(
                       q.Intersection([
                        q.Match(
                            q.Index("subscription_by_user_ref"),
                            q.Select(
                                "ref",
                                q.Get(
                                    q.Match(
                                        q.Index("user_by_email"),
                                        q.Casefold(session.user.email)
                                    )
                                )
                            )
                        ),
                        q.Match(
                            q.Index("subscription_by_status"),
                            "active"
                        )
                        ])
                    )
                )    
            
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },

        async signIn({user: User, account: Account, profile: Profile}) {

            const { email } = User

            try {
                await faunadb.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index("user_by_email"),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection("users"),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index("user_by_email"),
                                q.Casefold(email)
                            )
                        )
                    )
                )

                return true
            } catch (err) {
                console.log(`Erro ao cadastrar no banco => ${err}`)
                return false
            }

        }
    }
})