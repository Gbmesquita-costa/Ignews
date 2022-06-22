import { AppProps } from 'next/app'
import { ToastContainer } from "react-toastify"
import { SessionProvider as NextAuthProvider } from "next-auth/react"

import { Header } from "../components/header/header"

import "react-toastify/dist/ReactToastify.min.css"

import '../../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <ToastContainer />
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
