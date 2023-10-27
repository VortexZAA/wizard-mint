import { callNFTContract } from "./ethereumContracts";
import { useMemo } from 'react';

export const callMint = async () => {
    try {
        const { contractWithSigner } = await callNFTContract();
        let tx = await contractWithSigner.mint();
        let receipt = await tx.wait();
        return receipt.events[0].args[2].toNumber();
    } catch (error) {
        const err = error as any;  // Type assertion
    
        console.error("Error during minting:", err);
    
        // Check for user rejection
        if (err.code === 'ACTION_REJECTED') {
            alert('Transaction was rejected by the user.');
        } 
        // Check for revert reason: "You have already minted an artwork."
        else if (err.message && err.message.includes('You have already minted an artwork')) {
            alert('You have already minted a scroll.');
        }
        // Check for insufficient funds
        else if (err.message && err.message.includes('insufficient funds')) {
            alert('You do not have enough ETH in your account to mint.');
        }
        // Generic error message for other cases
        else {
            alert('There was an error during the minting process. Please check your eth balance and try again.');
        }
    
        throw err; 
    }
};


export const callTokenURI = async (id: number) => {
    try {
        const { contractWithSigner } = await callNFTContract();
        let uri = await contractWithSigner.tokenURI(id);
        return uri;
    } catch (error) {
        console.error("Error during tokenURI:", error);
        alert("There was an error during the tokenURI process. Please try again.");
        throw error;
    }
};