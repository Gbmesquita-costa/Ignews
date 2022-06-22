import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb"
import { getSession } from "next-auth/react"
import { stripe } from "../../services/stripe";
import { faunadb } from "../../services/fauna"

interface User {
    ref: {
        id: string
    }

    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const session = await getSession({ req })

        const user = await faunadb.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {
            const stripecustomer = await stripe.customers.create({
                email: session.user.email
            })

            await faunadb.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    { data: { stripe_customer_id: stripecustomer.id } }
                )
            )

            customerId = stripecustomer.id
        }


        const stripeChechoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            allow_promotion_codes: true,
            billing_address_collection: "required",
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                { price: process.env.STRIPE_PRODUCT_KEY, quantity: 1 }
            ],
        })

        res.status(200).json({ sessionId: stripeChechoutSession.id })
    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Post not allowed")
    }
}