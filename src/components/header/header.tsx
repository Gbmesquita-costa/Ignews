import { ActiveLink } from "../activeLink"
import { SigninButton } from "../SiginButton/signin"

import styles from "./index.module.scss"

export function Header() {
    return(
        <header className={styles.header}>
            <div className={styles.headercontent}>
                <img src="/images/logo.svg" alt="logo" />
                <nav>
                    <ActiveLink activeClassname={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>

                    <ActiveLink activeClassname={styles.active} href="/posts" >
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SigninButton />
            </div>
        </header>
    )
}