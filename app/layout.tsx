import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income, expenses, and financial goals with ease",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen text-gray-800 flex flex-col">
        <Toaster position="top-center" />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
