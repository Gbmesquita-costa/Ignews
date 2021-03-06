import { render } from "@testing-library/react"
import { ActiveLink } from "."

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/"
            }
        }
    }
})

test('Active link renders correctly', () => {
    const { debug } = render(
        <ActiveLink href="/" activeClassname="active">
            <a>Home</a>
        </ActiveLink>
    )

    debug()
}) 