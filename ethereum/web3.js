import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") { 
//if we are in the browser 'typeof window' should return 'object'
//if metamask has injected web3 onto the page window.ethereum should not be undefined
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://goerli.infura.io/v3/7f7b1febb20b42f98c8aa3c36a3719cd'
  );
  web3 = new Web3(provider);
}
//0x7e8B8507F9Dc95B51775D2ea5D7665E9A8159d0E
 
export default web3;