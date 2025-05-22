// index.js
import React, { useEffect, useState } from "react";
import CountrySelector from "./components/CountrySelector";
import BrandList from "./components/BrandList";

export default function Home() {
  const [country, setCountry] = useState("US");

  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_code) {
          setCountry(data.country_code);
        }
      })
      .catch((err) => console.log("GeoIP lookup failed", err));
  }, []);

  return (
    <div>
      <h1>🌍 Welcome to Stash or Trash!</h1>
      <p>The Global Standard in brand & product feedback</p>

      <CountrySelector selectedCountry={country} onChange={setCountry} />
      <BrandList selectedCountry={country} />
    </div>
  );
}
