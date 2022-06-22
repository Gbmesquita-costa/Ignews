import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"

import styles from "./index.module.scss"

export function SigninButton() {
    const { data: session } = useSession()

    console.log(session)

    return session ? (
        <button 
            className={styles.button}
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361"/>
            {session.user.name}
            <FiX className={styles.closeIcon}/>
        </button>
    ) : (
        <button 
            className={styles.button}
            onClick={() => signIn("github")}
        >
            <FaGithub color="var(--orange)" />
            Sign with Github
        </button>
    )
}