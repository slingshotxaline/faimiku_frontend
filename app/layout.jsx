import ReduxProvider from "../redux/ReduxProvider";
import AuthBootstrapMount from "../components/shared/AuthBootstrapMount";
import "../styles/globals.css";

export const metadata = {
  title: "Enterprise Store",
  description: "Modern Next.js e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthBootstrapMount />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
