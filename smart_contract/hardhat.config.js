// https://eth-goerli.g.alchemy.com/v2/_NJCgIg8VvexQARO0IzEKzxxRJWv6iCD

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity : '0.8.0',
  networks : {
    goerli : {
      url : 'https://eth-goerli.g.alchemy.com/v2/_NJCgIg8VvexQARO0IzEKzxxRJWv6iCD' ,
      accounts : ['e1e5b839f8268173bf47ff1c697b66c7e96d8e37c78aface6002e707a7d55ad7']
    }
  }
}