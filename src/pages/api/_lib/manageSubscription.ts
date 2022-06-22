import { query as q } from "faunadb"
import { faunadb } from "../../../services/fauna"
import { stripe } from "../../../services/stripe"

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
    const userref = await faunadb.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index("user_by_stripe_customer_id"),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptiondata = {
        id: subscription.id,
        userId: userref,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    if (createAction) {
        await faunadb.query(
            q.Create(
                q.Collection("Subscriptions"),
                { data: subscriptiondata }
            )
        )
    } else {
        await faunadb.query(
            q.Replace(
                q.Select(
                    "ref",
                q.Get(
                    q.Match(
                        q.Index("subscription_by_id"),
                        subscriptionId
                    )
                )
                ),
                {data: subscriptiondata }
            )
        )
    }
}