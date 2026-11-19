import { Instrument_Serif, Manrope } from "next/font/google";
import Gallery from "./gallery";

// Fonts load on the server; the gallery itself is a client component because of
// the light/dark switch, and the two themes pull from different asset folders.
const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function MimiMotion() {
  return <Gallery fontClass={`${instrument.variable} ${manrope.variable}`} />;
}
