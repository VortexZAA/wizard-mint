import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [random, setRandom] = useState({
    top: 0,
    right: 0,
  });
  const isconneted = true;
  /* useEffect(() => {
    let time = 700;

    setInterval(() => {
       //random coordinat number between 1 and 100
       const random = Math.floor(Math.random() * 80) + 1;
       //random coordinat number between 1 and 100
       const random2 = Math.floor(Math.random() * 70) + 1;
      setRandom({
        top: random,
        right: random2,
      });
      console.log(random, random2);
    }, time);
    return () => {
      clearInterval(time);
    };
  }, []); */
  const incrementRandom = () => {
    //random coordinat number between 1 and 100
    const random = Math.floor(Math.random() * 80) + 1;
    //random coordinat number between 1 and 100
    const random2 = Math.floor(Math.random() * 70) + 1;
    setRandom({
      top: random,
      right: random2,
    });
  };

  useEffect(() => {
    const timer = setTimeout(incrementRandom, 1000);
    return () => clearTimeout(timer);
  }, [random]);

  return (
    <main
      className={`flex min-h-screen max-w-[100vw] h-screen w-screen bg-wizardBg flex-col items-center justify-between p-3 md:p-6 relative overflow-hidden`}
    >
      <h1 className="text-black">
        Enter, traveler, into my realm. Should you desire to wield powers most
        extraordinary, I have 48 different power scrolls. If you want to have
        one, a mere gesture towards my essence is all that is required. Click,
        and behold the wonders that await. P.S. Use them with wisdom, for such
        artifacts demand great responsibility.
      </h1>

      <button
        className="absolute w-28 bg-[url('/wizard.gif')] h-28 bg-contain bg-no-repeat z-10 "
        onClick={() => {
          alert("You found the wizard");
        }}
        style={{
          right: `${isconneted ? random.top : 45}%`,
          top: `${isconneted ? random.right : 45}%`,
        }}
      ></button>
    </main>
  );
}
