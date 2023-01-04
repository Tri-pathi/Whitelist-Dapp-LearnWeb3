import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Web3Modal from "web3modal"
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { ABI, WhitelistContractAddress } from '../constant'
import { ethers } from "ethers";
import{providers} from "ethers"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
// walletConnected keep track of whether the user's wallet is connected or not
const [walletConnected, setWalletConnected] = useState(false);
// loading is set to true when we are waiting for a transaction to get mined
const [loading, setLoading] = useState(false);
// numberOfWhitelisted tracks the number of addresses's whitelisted
const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
// joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
const [joinedWhitelist, setJoinedWhitelist] = useState(false);


// Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
const web3ModalRef = useRef();






  const getProviderOrSigner=async(needsigner=false)=>{
    const provider=await web3ModalRef.current.connect();
    const web3Provider=new providers.Web3Provider(provider);
    const{chainId}=await web3Provider.getNetwork();
    if(chainId!==5){
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");

    }
    if(needsigner){
      const signer=web3Provider.getSigner();
      return signer;

    }
    return web3Provider;

  }






  const addAddressToWhitelist=async()=>{
    try {
      const signer=await getProviderOrSigner(true);
     const whitelist= new ethers.Contract(WhitelistContractAddress,ABI,signer);
     const transactionResponse=await whitelist.addAddressToWhitelist();
     setLoading(true);
     await transactionResponse.wait();
     setLoading(false);
     await getNumberOfWhitelisted();
     setJoinedWhitelist(true);
      
    } catch (error) {
      console.log(error);
    }
  }








  const getNumberOfWhitelisted=async()=>{
    try {
      const provider=await getProviderOrSigner();
      const whitelist=new ethers.Contract(WhitelistContractAddress,ABI,provider);
      const _NumberofWhitelisted=await whitelist.numAddressesWhitelisted();
      setNumberOfWhitelisted(_NumberofWhitelisted);
       } catch (error) {
      console.log(error);
    }

  }





  const checkIfAddressInWhitelist=async()=>{
    try {
      const signer=await getProviderOrSigner(true);
      const whitelist=new ethers.Contract(WhitelistContractAddress,ABI,signer);
      const address=await signer.getAddress();
      const _joinedWhitelist=await whitelist.WhitelistAddress(address)
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.log(error);
    }
  }

const connectWallet=async()=>{
  try {
    await getProviderOrSigner();
    setWalletConnected(true);
    checkIfAddressInWhitelist();
    getNumberOfWhitelisted();
  } catch (error) {
    console.log(error);
  }
}




const renderButton=()=>{
  if(walletConnected){
    if(joinedWhitelist){
      return (
        <div className={styles.description}>
       Thanks for joining the Whitelist
        </div>
      );
    }else if(loading){
      return <button className={styles.button}>Loading.....</button>
    }else{
      return(
        <button onClick={addAddressToWhitelist} className={styles.button}> Join the Whitelist</button>
      )
    }
  }else{
    return(
      <button onClick={connectWallet} className={styles.button}> Connect your wallet</button>
    )
  }
  }





  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current=new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider:false,
      });
      connectWallet();
    }
  },[walletConnected]);




  return (
<div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs of LearnWeb3 !</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Tripathi
      </footer>
    </div>
  );
}