import Web3 from "web3";

import fs from 'fs';

var NFT_ABI = JSON.parse(fs.readFileSync('./build/contracts/RBCC.json'));

var NFT_ABI_CODE = NFT_ABI.abi;

var MULTIABI = JSON.parse(fs.readFileSync('./build/contracts/Multicall.json'));

var MULTIABI_CODE = MULTIABI.abi;

(async () => {
  const web3 = new Web3(
    "http://127.0.0.1:8545/"
  );

  // address of ERC721 NFT
  const nftAddress = "0x75dBcaB1B4966b7841eC0B2C9c5bdd4052906dDD";
  // ERC721 abi to interact with contract
  const nftAbi = NFT_ABI_CODE;

  // interact with contract
  const nftContract = new web3.eth.Contract(nftAbi, nftAddress);

  // generate call data to get owner of token #1
  const callData1 = nftContract.methods["ownerOf"](1).encodeABI();
  const ownerOfToken1 = await web3.eth.call({
    to: nftAddress,
    data: callData1,
  });

  const callData2 = nftContract.methods["ownerOf"](1).encodeABI();
  const ownerOfToken2 = await web3.eth.call({
    to: nftAddress,
    data: callData2,
  });
/* 
  const callData3 = nftContract.methods["ownerOf"](1).encodeABI();
  const ownerOfToken3 = await web3.eth.call({
    to: nftAddress,
    data: callData3,
  }); */


  console.log(ownerOfToken1);
  console.log(ownerOfToken1);
  //console.log(ownerOfToken1);

  // ----------------------------------------------------------------------------------
  // multicall
  // ----------------------------------------------------------------------------------

  // address of multicall contract
  /* A */
})();
