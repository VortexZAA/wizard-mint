import { callMint, callTokenURI } from "@/contractInteractions/useappContracts";
import connect from "@/hook/connect";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const [random, setRandom] = useState({
    top: 0,
    right: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(true);
  const [nftImage, setNftImage] = useState("");
  const [nftdata, setNftdata] = useState({
    name: "",
    description: "",
    image: "",
    attributes: [],
  });
  const [address, setAddress] = useState("");
  const text =
    "Enter, traveler, into my realm. Should you desire to wield powers most extraordinary, I have 48 different power scrolls. If you want to have one, a mere gesture towards my essence is all that is required. Click, and behold the wonders that await. P.S. Use them with wisdom, for such artifacts demand great responsibility.";
  const typeRef: any = useRef(null);

  const [isconneted, setIsConnected] = useState(false);
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

  async function connectWallet() {
    const address: any = await connect();
    if (address) {
      setIsConnected(true);
      setAddress(address);
    }
    //alert(address);
  }

  async function success() {
    setLoading(true);
    try {
      let id = await callMint();
      let uri = await callTokenURI(id);

      let res = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      let data = await res.json();
      setNftImage(data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
      setNftdata(data);
      importToMetamask(
        id,
        data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
      );
      alert("You found the wizard, so your prize is " + id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error minting:", error);
    }
  }
  useEffect(() => {
    const timer = setTimeout(incrementRandom, 1000);

    typeRef?.current?.innerHTML.length === text.length &&
      setTimeout(() => setShowText(false), 2000);
    return () => clearTimeout(timer);
  }, [random]);

  return (
    <main
      className={`flex min-h-screen max-w-[100vw] h-screen w-screen bg-wizardBg flex-col items-center justify-between p-3 md:p-6 relative overflow-hidden`}
    >
      {showText ? (
        <h1 className="text-black font-medium opacity-80 text-2xl ">
          <TypeAnimation
            sequence={[
              `${"Enter, traveler, into my realm. Should you desire to wield powers most extraordinary, I have 48 different power scrolls. If you want to have one, a mere gesture towards my essence is all that is required. Click, and behold the wonders that await. P.S. Use them with wisdom, for such artifacts demand great responsibility."}`,
            ]}
            wrapper="div"
            speed={60}
            cursor={true}
            repeat={0}
            ref={typeRef}
            className="h-auto min-h-[110px] cursor"
            omitDeletionAnimation={true}
          />
        </h1>
      ) : (
        !isconneted && (
          <button
            onClick={connectWallet}
            className=" rounded-md p-6 bg-[url('/button.svg')] bg-no-repeat bg-contain "
          >
            CONNECT WALLET
          </button>
        )
      )}

      {!nftImage && (
        <button
          className="absolute w-28 bg-[url('/wizard.gif')] h-28 bg-contain bg-no-repeat z-10 "
          onClick={() => isconneted && success()}
          style={{
            right: `${isconneted && !loading ? random.top : 45}%`,
            top: `${isconneted && !loading ? random.right : 45}%`,
          }}
        ></button>
      )}
      {loading && (
        <div className="absolte z-50 h-full w-full flex justify-center items-center backdrop-blur-md">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-32 h-32 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {nftImage && (
        <div className="absolute w-full h-full flex justify-center items-center z-50 ">
          <div className=" border-2 text-black gap-3 rounded-xl p-6 flex flex-col w-full max-w-md h-fit items-center">
            <h2>{nftdata.name}</h2>
            <p>{nftdata.description}</p>
            <img
              src={nftImage}
              alt="NFT"
              width="100"
              className=""
              height="100"
            />
          </div>
        </div>
      )}
      <div className="absolute bottom-0 w-full h-16 p-3 flex justify-center items-center gap-3 max-w-7xl text-black ">
        <a
          href="https://twitter.com/mywizardscroll"
          target="_blank"
          rel="noopener"
          className="w-7"
        >
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.85587 6.0346L14.1572 0H12.9014L8.29631 5.23868L4.62098 0H0.380859L5.9399 7.92257L0.380859 14.25H1.63666L6.49661 8.71659L10.3789 14.25H14.619M2.08991 0.927377H4.01918L12.9005 13.3682H10.9707"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a
          href="https://scrollscan.com/token/0xc422a83f8c6add1652d5f11a07fa3d35a1d54900"
          target="_blank"
          rel="noopener"
          className="w-8 h-8"
        >
          <svg
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_8126_3978)">
              <path
                d="M237.773 172.785V24.8549C237.497 12.47 227.694 2.56213 215.266 2.56213H60.3409C26.9256 3.11257 0 30.3593 0 63.7984C0 75.0824 3.03775 84.7151 7.73247 93.2469C11.5987 100.265 17.8123 106.87 23.8878 111.962C25.5448 113.338 24.7163 112.787 29.9633 116.09C37.2816 120.494 45.5663 122.695 45.5663 122.695V211.178C45.7044 215.307 46.2567 219.435 47.2233 223.15C50.6753 235.535 59.3743 245.168 71.1111 249.847C76.082 251.773 81.6052 253.149 87.5426 253.149L211.262 253.562C235.978 253.562 256 233.609 256 208.977C256 193.977 248.82 180.904 237.773 172.785Z"
                fill="#FFEEDA"
              />
              <path
                d="M241 209.96C240.446 225.85 227.422 238.562 211.488 238.562L126 238.286C132.789 230.41 136.946 220.185 136.946 209.131C136.946 191.583 126.416 179.562 126.416 179.562H211.488C227.837 179.562 241 192.827 241 209.131V209.96Z"
                fill="#EBC28E"
              />
              <path
                d="M31.8793 99.018C22.0809 89.7716 15.1806 77.7651 15.1806 63.4125V61.8945C16.0087 37.6055 36.0195 18.0087 60.3085 17.1806H215.151C219.153 17.3186 222.465 20.2168 222.465 24.3569V155.324C226.053 156.014 227.709 156.428 231.16 157.67C233.782 158.636 237.646 160.845 237.646 160.845V24.3569C237.37 11.9364 227.571 2 215.151 2H60.3085C26.9111 2.55202 0 29.8771 0 63.4125C0 82.8713 8.83237 99.57 23.461 111.301C24.427 112.129 25.393 113.095 28.0152 113.095C32.5693 113.095 35.7435 109.506 35.6055 105.504C35.4675 102.192 34.0874 100.95 31.8793 99.018Z"
                fill="#190602"
              />
              <path
                d="M211.286 164.157H89.8405C81.6982 164.157 75.0739 170.919 75.0739 179.061V196.45C75.3499 204.454 82.2502 211.493 90.2545 211.493H99.2249V196.45H90.2545V179.337C90.2545 179.337 92.4626 179.337 95.2227 179.337C110.541 179.337 121.858 193.552 121.858 208.871C121.858 222.395 109.575 239.646 89.0125 238.266C70.6577 237.024 60.8593 220.739 60.8593 208.871V60.7904C60.8593 54.1661 55.4771 48.6459 48.7148 48.6459H36.5703V63.8265H45.5407V208.871C45.1267 238.404 66.5175 253.308 88.8745 253.308L211.286 253.722C235.989 253.722 255.999 233.712 255.999 209.009C255.999 184.305 235.989 164.157 211.286 164.157ZM240.681 209.837C240.129 225.707 227.156 238.404 211.286 238.404L126.136 238.128C132.898 230.261 137.038 220.049 137.038 209.009C137.038 191.482 126.55 179.475 126.55 179.475H211.286C227.57 179.475 240.681 192.724 240.681 209.009V209.837Z"
                fill="#190602"
              />
              <path
                d="M179.546 66.4486H87.082V51.406H179.546C183.272 51.406 186.17 54.4421 186.17 58.0303V59.8244C186.17 63.5505 183.134 66.4486 179.546 66.4486Z"
                fill="#190602"
              />
              <path
                d="M179.546 137.798H87.082V122.755H179.546C183.272 122.755 186.17 125.791 186.17 129.379V131.173C186.17 134.762 183.134 137.798 179.546 137.798Z"
                fill="#190602"
              />
              <path
                d="M195.552 102.192H86.9414V87.1494H195.552C199.278 87.1494 202.176 90.1855 202.176 93.7737V95.5678C202.314 99.1559 199.278 102.192 195.552 102.192Z"
                fill="#190602"
              />
            </g>
            <defs>
              <clipPath id="clip0_8126_3978">
                <rect width="256" height="256" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a
          href="https://scroll.io/bridge"
          target="_blank"
          rel="noopener"
        >
          <img src="/bridge.jpg" className="w-fit h-12" alt="" />
        </a>
      </div>
    </main>
  );
}

async function importToMetamask(id: number, image: string) {
  const ethereum = window.ethereum as any;

  try {
    // Check if MetaMask is installed and Ethereum provider is injected
    if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
      // Use MetaMask's provider
      //const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Suggest adding the NFT to the user's MetaMask assets
      const added = ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC721",
          options: {
            address: process.env.NEXT_PUBLIC_CONTRACT, // Replace with your NFT smart contract address
            symbol: "SCROLLs", // Replace with a short string to represent your asset, like 'MYNFT'
            decimals: 0, // ERC721 assets are non-fungible, so decimals is always 0
            image: image, // Use the nftImage state to provide the image URL
            tokenId: id.toString(), // Convert the tokenId to a string
          },
        },
      });

      // If successfully added, the result will be true
      if (added) {
        console.log("Successfully added NFT to MetaMask");
      } else {
        console.error("Something went wrong adding the NFT to MetaMask");
      }
    } else {
      console.error("Please install MetaMask");
    }
  } catch (error) {
    console.error("Error importing NFT to MetaMask:", error);
  }
}
