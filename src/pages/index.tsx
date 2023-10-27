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
      importToMetamask(id, data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
      alert("You found the wizard, so your prize is " + id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error minting:", error);
      alert("There was an error. Please try again.");
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

     {!nftImage && <button
        className="absolute w-28 bg-[url('/wizard.gif')] h-28 bg-contain bg-no-repeat z-10 "
        onClick={() => isconneted && success()}
        style={{
          right: `${isconneted && !loading  ? random.top : 45}%`,
          top: `${isconneted && !loading ? random.right : 45}%`,
        }}
      ></button>}
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
            <img src={nftImage} alt="NFT" width="100" className="" height="100" />
          </div>
        </div>
      )}
    </main>
  );
}

/* async function importToMetamask(id:number, image:string) {
  const ethereum = window.ethereum as any;
  const userAddress = (await ethereum.request({ method: 'eth_accounts' }))[0];
  const tokenId = id;

  try {
      // Check if MetaMask is installed and Ethereum provider is injected
      if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
          // Use MetaMask's provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          // Suggest adding the NFT to the user's MetaMask assets
          const added = await provider.request({
              method: 'wallet_watchAsset',
              params: {
                  type: 'ERC721',
                  options: {
                      address: "YOUR_CONTRACT_ADDRESS_HERE", // Your NFT smart contract address
                      symbol:'WZDS',
                      decimals: 0, // ERC721 assets are non-fungible, so decimals is always 0
                      image: image, // A string url of the token logo (can use your NFT's metadata)
                      tokenId: tokenId // The ID of the minted NFT
                  },
              },
          });

          // If successfully added, the result will be true
          if (added) {
              console.log('Successfully added NFT to MetaMask');
          } else {
              console.error('Something went wrong adding the NFT to MetaMask');
          }
      } else {
          console.error('Please install MetaMask');
      }
  } catch (error) {
      console.error(error);
  }
}  */
async function importToMetamask(id: number,image:string) {
  const ethereum = window.ethereum as any;

  try {
    // Check if MetaMask is installed and Ethereum provider is injected
    if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
      // Use MetaMask's provider
      //const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Suggest adding the NFT to the user's MetaMask assets
      const added = ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: process.env.NEXT_PUBLIC_CONTRACT_DEVELOPMENT, // Replace with your NFT smart contract address
            symbol: "WZDS", // Replace with a short string to represent your asset, like 'MYNFT'
            decimals: 0, // ERC721 assets are non-fungible, so decimals is always 0
            image: image, // Use the nftImage state to provide the image URL
            tokenId: id.toString() // Convert the tokenId to a string
          },
        },
      });
      console.log(added);
      
      // If successfully added, the result will be true
      if (added) {
        console.log('Successfully added NFT to MetaMask');
      } else {
        console.error('Something went wrong adding the NFT to MetaMask');
      }
    } else {
      console.error('Please install MetaMask');
    }
  } catch (error) {
    console.error("Error importing NFT to MetaMask:", error);
  }
}
/* async function success() {
  setLoading(true);
  try {
    let id = await callMint();
    let uri = await callTokenURI(id);

    let res = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
    let data = await res.json();
    setNftImage(data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
    setNftdata(data);

    alert("You found the wizard, so your prize is " + id);
    setLoading(false);

    // Import the minted NFT to MetaMask
    importToMetamask(id);

  } catch (error) {
    setLoading(false);
    console.error("Error minting:", error);
    alert("There was an error. Please try again.");
  }
} */