import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays";
import Navbar from "../components/NavBar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted_grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-Mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dev Event",
  description: "The hub for every Dev Event You Musn't Miss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <Navbar></Navbar>
        <div className={"absolute inset-0 top-0 z-[-1] min-h-screen"}>
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        {children}
      </body>
    </html>
  );
}
