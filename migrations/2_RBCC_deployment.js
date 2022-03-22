const RBCC = artifacts.require("RBCC");

let NAME = 'Ripped Bull Community Club';

let symbol = 'RBCC';

let baseURL = 'ipfs://';

let notRevealedURL = 'ipfs://abcd';

module.exports = function (deployer) {
  deployer.deploy(RBCC, NAME, symbol, baseURL, notRevealedURL);
};
