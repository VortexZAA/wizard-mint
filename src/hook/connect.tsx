import { ethers } from "ethers";


const connect = async () => {
    let ethereum = (window as any).ethereum;
    console.log(ethereum);
    
    try {
      if (typeof window !== "undefined" && ethereum && ethereum.isMetaMask) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await ethereum.send("eth_requestAccounts");

        const signer = await provider?.getSigner();
        const address = await signer?.getAddress();
        console.log(address);
        return address;
      }
    } catch (error) {
        console.log(error);
        }
    }
export default connect;
