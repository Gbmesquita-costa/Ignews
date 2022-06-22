import { GetStaticProps } from "next"
import Head from 'next/head'
import { CloseButton } from "react-toastify/dist/components"
import { SubsCribe } from "../components/subscribeButton/subscribe"
import { stripe } from "../services/stripe"
import styles from "./index.module.scss"

interface PaymentWithProps {
  data: {
    id: string
    amount: string
  }
}

export default function Home({ data }: PaymentWithProps ) {

  return (
    <>
      <Head>
        <title>Home | Ignews</title>
      </Head>
      <main className={styles.main}>
        <section>
          <span>
            👋 Hey, welcome to my Website
          </span>

          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access to all the publications <br />
            <span>
              for {data.amount} month 
            </span>
          </p>

          <SubsCribe priceId={data.id} />

        </section>
        <img src="/images/avatar.svg" alt="avatar" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const payment = await stripe.prices.retrieve(process.env.STRIPE_PRODUCT_KEY)

  const data = {
    id: payment.id,
    amount: new Intl.NumberFormat("pt-Br", {
      style: "currency",
      currency: "BRL"
    }).format(payment.unit_amount / 100)
  }

  return {
    props: {
      data
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
