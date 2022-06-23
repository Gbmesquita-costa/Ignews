import { AppProps } from 'next/app'
import { ToastContainer } from "react-toastify"
import { SessionProvider as NextAuthProvider } from "next-auth/react"

import { Header } from "../components/header/header"

import "react-toastify/dist/ReactToastify.min.css"

import '../../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any

  return (
      <NextAuthProvider session={pageProps.session}>
          <Header />
          <ToastContainer />
          <AnyComponent {...pageProps} />
      </NextAuthProvider>
  )
}

export default MyApp
