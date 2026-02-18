"use client";

import { usePathname } from "next/navigation";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./globals.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/register",
    "/admin/login",
    "/user/chat"
  ];

  const isAdminOrOperatorRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/operator");

  const shouldShowHeader =
    !hideHeaderRoutes.includes(pathname) && !isAdminOrOperatorRoute;

  return (
    <html lang="en">
      <body className="font-sans">
        <Provider store={store}>
          <AuthProvider>
            <Elements stripe={stripePromise}>
              {shouldShowHeader && <Header />}

              <div className={shouldShowHeader ? "pt-[80px]" : ""}>
                {children}
              </div>

              {shouldShowHeader && <Footer />}
            </Elements>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
