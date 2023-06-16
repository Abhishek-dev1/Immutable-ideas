import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import IdeaNFTPrototype from './assets/IdeaNFTPrototype.svg';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom"
import IdeaNFT from './utils/IdeaNFT.json';
const TWITTER_HANDLE = 'Ayush Singh';
const TWITTER_LINK = `https://twitter.com/Ayush_cg`;
const TWITTER_HANDLE2 = 'Abhishek';
const TWITTER_LINK2 = `https://twitter.com/Abhi_2002_`;
const TWITTER_HANDLE3 = 'Dipesh';
const TWITTER_LINK3 = `https://twitter.com/Dipeshjaswani2`;
const OPENSEA_LINK = 'https://opensea.io/collection/ideanft-v2';
const OPENSEA_ASSETS_LINK = 'https://opensea.io/assets/0xbae56e96ea899f672cbc9094b93142b477f6caad/';

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0xbae56e96ea899f672cbc9094b93142b477f6caad";
const Primary = () => {
  
  const [ideaName , setideaName] = useState("");
  const [description , setdescription] = useState("");
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

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
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
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaNFT, signer);

        // For capturing event on the smart contract.
        connectedContract.on("IdeaNFTMinted", (from, tokenId) => {
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

  const validation = (ideaName, description, twitter) => {
      if(ideaName === "" || description === "" || twitter === "") {
        return false;
      } else {
        return true;
      }
  }

  const changeDescription = (description, twitter) => { 
    let twitterId = twitter.substring(20);
    return `${description} Idea By: ${twitterId}`;
  }

  const askContractToMintNft = async (event) => {
    try {

      event.preventDefault();
      
      const { ethereum } = window;
      
      if (ethereum) {

        if(validation(ideaName, description, twitter) === false) {
          window.alert("Please, provide the valid fields.")                         
        }
        else {

          setdescription(changeDescription(description, twitter));
          console.log(description);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IdeaNFT, signer);

          var trimmedDescription = description.substring(0, 12);
          
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.getIdeaDetails(ideaName, trimmedDescription, twitter, description);

          console.log(nftTxn);
          console.log("Mining...please wait.");
          await nftTxn.wait();
          console.log(nftTxn);

          let newTokenId = await connectedContract.getTokenId();
          newTokenId = newTokenId - 1;
      
          // showing the user that his idea is minted
          console.log(`Mined, see transaction: https://polygonscan.com/tx/${nftTxn.hash}`);

          let link = `${OPENSEA_ASSETS_LINK}${newTokenId}`;
          navigator.clipboard.writeText(link);
          alert("Your Idea has been minted on the blockchain!, Check it out on Opensea✔️: " +link +" Transaction: Mined, see transaction: https://polygonscan.com/tx/" +nftTxn.hash);
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
        <span className="input-group-text" id="basic-addon3" >Idea Name</span>
        <input type="text" className="form-control Idea" onChange={e=>setideaName(e.target.value)}  id="basic-url" aria-  
        describedby="basic-addon3" placeholder="Immutable Ideas"/>
      </div>


      <div className="input-group">
        <span className="input-group-text">Idea Description</span>
        <textarea   onChange={e=>setdescription(e.target.value)} className="form-control ideaDes" aria-label="With textarea"     
        placeholder="In details"></textarea>
      </div>
      <div className="input-group mb-3 my-3">
        <span className="input-group-text" id="basic-addon1" >
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        </span>
        <input  onChange={e=>settwitter(e.target.value)} type="text" className="form-control Twitter-Link" placeholder="https://twitter.com/Ayush_cg" aria-label="Username" aria-describedby="basic-addon1" />
      </div>
      
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint IdeaNFT
    </button>
      <br/>
      <br/>
      
            
              <Link to="/secondary"
            className="footer-text"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none',
                   fontSize:"1.2rem"}}
          >SecondaryNFT</Link>
      <br/>
        <div className="container " style={{width:"14rem",height:"14rem",paddingTop:"1rem"}}>
          <img src={IdeaNFTPrototype} style={{borderRadius:"10%"}}/>
        </div>
      
    </>
  )

  return (
    
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Immutable Ideas!</p>
          <p className="sub-text">
            Got an Idea? Mint it on the Blockchain as a Proof-of-Idea origination.🎏
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">


          <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`View all the Ideas on Opensea, and checkout if you wanna work on any!🌊`}</a>
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

export default Primary;