import styles from "./styles.module.scss"
import { toast } from "react-toastify"
import { api } from "../../services/api"
import { GetstripeJs } from "../../services/stripe-js"
import { useSession, signIn } from "next-auth/react"

interface DataWithProps {
    priceId: string
}

export function SubsCribe({ priceId }: DataWithProps) {
    
    const { data: session } = useSession()

    async function handleSubscribe() {
        try{
            if (!session) {
                signIn("github")
                return
            }

            const response = await api({ method: "POST", url: "/subscribe" })

            const { sessionId } = response.data

            const stripeJs = await GetstripeJs

            stripeJs.redirectToCheckout({ sessionId })

        } catch(err) {
            toast.error(err.message)
        }
    }

    return(
        <button 
            type="button"
            className={styles.button}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}
