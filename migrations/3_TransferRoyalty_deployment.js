const TransferRoyalty = artifacts.require("TransferRoyalty");

module.exports = function (deployer) {
  deployer.deploy(TransferRoyalty);
};
