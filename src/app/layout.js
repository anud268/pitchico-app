import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Pitchico - Premium Smart Essentials",
  description: "Pitchico E-Commerce Store for Premium Smart Essentials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
