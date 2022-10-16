
# Immutable Ideas

Immutable Ideas is a decentralized application that lets you mint your unique, and out of the worlds Ideas on the Blockchain as NFTs, so that they become Immutable and Provable for internity.

The dapp also allows you to create a Secondary NFT, which you may give to someone who wants to work on your idea alongside you or on your behalf.
## Tech-Stack

**Polygon, Solidity, SVGs, and React.**


## [Website](https://immutable-ideas.herokuapp.com/)
## Smart Contract Discription 

### IdeaNFT.sol
It is an ERC721 Smart Contract that converts the primary Idea into pngs and mints them on the blockchain.
In the meta data of the IdeaNFT, we store the Idea owner's Twitter link as an external url.

### SecondaryIdeaNFT.sol
It is also an ERC721 Smart Contract which lets the owner of IdeaNFT mint an SecondaryNFT for a person who is willing to work on his or her Idea.
