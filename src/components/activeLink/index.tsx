import Link, { LinkProps } from "next/link"
import { useRouter } from "next/router"
import { cloneElement, ReactElement } from "react"


interface LinkWithProps extends LinkProps {
    children: ReactElement,
    activeClassname: string
}

export function ActiveLink({ children, activeClassname, ...rest }: LinkWithProps) {

    const { asPath } = useRouter()

    const className = asPath === rest.href ? activeClassname : null

    return(
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}