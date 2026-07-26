import { Suspense } from "react";
import ReduxProvider from "../redux/ReduxProvider";
import AuthBootstrapMount from "../components/shared/AuthBootstrapMount";
import PageViewTracker from "../components/shared/PageViewTracker";
import "../styles/globals.css";

export const metadata = {
  title: "Faimiku",
  description: "Modern Next.js e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthBootstrapMount />

          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>

          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
