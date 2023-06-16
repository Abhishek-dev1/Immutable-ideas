import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg'
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom"
import SecondaryNFT from './utils/SecondaryNFT.json';
import IdeaNFT from './utils/IdeaNFT.json';
const TWITTER_HANDLE = 'Ayush Singh';
const TWITTER_LINK = `https://twitter.com/Ayush_cg`;
const TWITTER_HANDLE2 = 'Abhishek';
const TWITTER_LINK2 = `https://twitter.com/Abhi_2002_`;
const TWITTER_HANDLE3 = 'Dipesh';
const TWITTER_LINK3 = `https://twitter.com/Dipeshjaswani2`;
const OPENSEA_LINK = 'https://opensea.io/collection/secondarynft';
const OPENSEA_ASSETS_LINK = 'https://opensea.io/assets/0x92029140a1e465cf81833e1187cd57d60ee6afdd/';

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x92029140a1e465cf81833e1187cd57d60ee6afdd";
const CONTRACT_ADDRESSIdeaNFT = "0xbae56e96ea899f672cbc9094b93142b477f6caad";

const Secondary = () => {
   useEffect(() => {
    document.title = "Secondary NFT"
  }, [])
    const [originalIdeaName , setOriginalIdeaName] = useState("");
    const [openseaLink , setOpenseaLink] = useState("");
    const [ethAddress , setethAddress] = useState("");
    const [twitter , settwitter] = useState("");
  
    const [currentAccount, setCurrentAccount] = useState("");
    
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
      
      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const chainId = await ethereum.request({ method: 'eth_chainId' });

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      const polygonChainId = "0x137";
      const polygonChainId2 = "0x89";
      if (chainId !== polygonChainId && chainId !== polygonChainId2) {
        alert("You are not connected to the Polygon Network!");
      }

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft.
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, SecondaryNFT, signer);

        // For capturing event on the smart contract.
        connectedContract.on("SecondaryNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up 
          on OpenSea. Here's the link: https://opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const validation = (originalIdeaName, openseaLink, ethAddress, twitter) => {
      if(originalIdeaName === "" || openseaLink === "" || ethAddress === "" || twitter === "") {
        return false;
      } else {
        return true;
      }
  }

  const changeTwitterLink = (twitter) => { 
    return twitter.substring(20);
  }

  const askContractToMintNft = async (event) => {
    try {
      event.preventDefault();
      
      const { ethereum } = window;
      
      if (ethereum) {

        if(validation(originalIdeaName, openseaLink, ethAddress, twitter) === false) {
          window.alert("Please, provide the valid fields.")                         
        }
        else {
          
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          const IdeaNFTContract = new ethers.Contract(CONTRACT_ADDRESSIdeaNFT, IdeaNFT, signer);
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, SecondaryNFT, signer);
          
          const originalTokenId = openseaLink.substring(75);
          console.log(originalTokenId);
          
          let ownerAddress = await IdeaNFTContract.ownerOf(parseInt(originalTokenId));
          ownerAddress.toString();
          
          console.log(ownerAddress);
          console.log(currentAccount);

          const result = ownerAddress.localeCompare(currentAccount, undefined, { sensitivity: 'base' });

          if(result != 0) {
            window.alert("You are not the owner of IdeaNFT#" +originalTokenId);
            return;
          }

          const twitterName = changeTwitterLink(twitter);
          
          console.log("Going to pop wallet now to pay gas...");

          // Change on deployment of the contract.
          let nftTxn = await connectedContract.getMakerDetails(originalIdeaName, openseaLink, ethAddress, twitterName, originalTokenId);

          console.log(nftTxn);
          console.log("Mining...please wait.");
          await nftTxn.wait();
          console.log(nftTxn);

          let newTokenId = await connectedContract.getTokenId();
          newTokenId = newTokenId;
      
          // showing the user that his idea is minted
          console.log(`Mined, see transaction: https://polygonscan.com/tx/${nftTxn.hash}`);

          let link = `${OPENSEA_ASSETS_LINK}${newTokenId}`;
          navigator.clipboard.writeText(link);
          alert("Your SecondaryNFT has been minted on the blockchain!, Check it out on Opensea✔️: " +link);
        }

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

 

  const renderMintUI = () => (

    // For Getting Idea
    <>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon3" >Original Idea Name</span>
        <input type="text" className="form-control Idea" onChange={e=>setOriginalIdeaName(e.target.value)}  id="basic-url" aria-  
        describedby="basic-addon3" placeholder="Immutable Ideas"/>
      </div>


      <div className="input-group">
        <span className="input-group-text">OpenSea URL</span>
        <input   onChange={e=>setOpenseaLink(e.target.value)} className="form-control ideaDes" aria-label="With textarea"     
        placeholder="OpenSea Link of IdeaNFT"></input>
      </div>
      <div className="input-group my-3">
        <span className="input-group-text">Polygon Address of Guest Maker</span>
        <input   onChange={e=>setethAddress(e.target.value)} className="form-control ideaDes" aria-label="With textarea"     
        placeholder="0xc2dcaaa14DF335bf95ee37c9CeEC1b4e285E61E9"></input>
      </div>
      <div className="input-group mb-3 my-3">
        <span className="input-group-text" id="basic-addon1" >
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        </span>
        <input  onChange={e=>settwitter(e.target.value)} type="text" className="form-control Twitter-Link" placeholder="Of Owner(https://twitter.com/Ayush_cg)" aria-label="Username" aria-describedby="basic-addon1" />
      </div>
      
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint Secondary IdeaNFT
    </button>
     
      
    </>
  )

  return (
    
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Immutable Ideas!</p>
          <p className="sub-text">
            Were you preoccupied and unable to focus on your Immutable Ideas? That's sad😔  <br/>But don't worry, we got you! 
            ✊ You can now allow others to work on your Immutable Ideas by giving them a Proof-Of-Working Secondary NFT by providing their Polygon Address to us!🎉
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`View all the Ideas on Opensea!🌊`}</a>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <div className="footer-text">built by&nbsp;&nbsp;</div>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >{`@${TWITTER_HANDLE}`}</a>
          <a
            className="footer-text"
            href={TWITTER_LINK2}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >&nbsp;&nbsp;&nbsp;{`@${TWITTER_HANDLE2}`}</a>
          <a
            className="footer-text"
            href={TWITTER_LINK3}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >&nbsp;&nbsp;&nbsp;{`@${TWITTER_HANDLE3}`}</a>
        </div>
      </div>
    </div>
  );
};

export default Secondary;