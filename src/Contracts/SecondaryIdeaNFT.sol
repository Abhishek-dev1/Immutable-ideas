// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/Brechtpd/base64/blob/main/base64.sol";
import "https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-core/console.sol";

contract SecondaryNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /> <text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  
  // struct to store information of secondary NFT.
  struct SecondaryNFT_MetaData {
    string OriginalIdeaName;
    string OpenSeaLink_of_originalIdea;
    address PublicKeyOf_GuestMaker;
    string IdeaOwnerTwitterID;
    string IdeaTokenId;
  }

  // object for Secondary NFT. Setting default ethereum address as msg.sender, it will be changed later.
  SecondaryNFT_MetaData public secondaryNFT = SecondaryNFT_MetaData("", "", msg.sender, "", "");

  event NewIdeaNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("SecondaryNFT", "2ndIDEA") {
    console.log("By this you can let you idea be made by a Guest Maker!");
  }

  function getMakerDetails(string memory _OriginalIdeaName, string memory _OpenSeaLink_of_originalIdea, address _PublicKeyOf_GuestMaker, string memory _IdeaOwnerTwitterID, string memory _IdeaTokenId) public {
    require(bytes(_OriginalIdeaName).length > 0);
    require(bytes(_OpenSeaLink_of_originalIdea).length > 0);
    
    require(bytes(_IdeaOwnerTwitterID).length > 0);
    require(bytes(_IdeaTokenId).length > 0);

    secondaryNFT.OriginalIdeaName = _OriginalIdeaName;
    secondaryNFT.OpenSeaLink_of_originalIdea = _OpenSeaLink_of_originalIdea;
    secondaryNFT.PublicKeyOf_GuestMaker = _PublicKeyOf_GuestMaker;
    secondaryNFT.IdeaOwnerTwitterID = _IdeaOwnerTwitterID;
    secondaryNFT.IdeaTokenId = _IdeaTokenId;

    // Minting an 2ndIdea NFT for the guest maker as a Proof-of-Working on the Idea by an other person.
    makeAn2ndIdeaNFT();
  }

  function getTokenId() public view returns(uint) {
    return _tokenIds.current();
  }

  function makeAn2ndIdeaNFT() internal {

    // getting current tokenId
    uint256 newItemId = _tokenIds.current();

    string memory originalIdeaName = secondaryNFT.OriginalIdeaName;
    originalIdeaName = string(abi.encodePacked("Working on ",originalIdeaName));
    string memory openSeaLink_of_originalIdea = secondaryNFT.OpenSeaLink_of_originalIdea;
    address publicKeyOf_GuestMaker = secondaryNFT.PublicKeyOf_GuestMaker;
    string memory ideaOwnerTwitterID = secondaryNFT.IdeaOwnerTwitterID;
    string memory ideaTokenId = secondaryNFT.IdeaTokenId;

    string memory prefix = "Proof-Of-Working on IdeaNFT#";
    
    prefix = string(abi.encodePacked(prefix,ideaTokenId));

    string memory baseNextLine = "<tspan class='strong em' font-family='serif' x ='50%' y='60%'>";
    string memory suffix = "By ";

    suffix = string(abi.encodePacked(suffix,ideaOwnerTwitterID));
    string memory nextLineOfSVG = string(abi.encodePacked(baseNextLine, suffix, "</tspan>"));
    string memory finalSvg = string(abi.encodePacked(baseSvg, prefix, nextLineOfSVG, "</text></svg>"));

    string memory description = string(abi.encodePacked("This NFT is Proof-Of-Working given by IdeaNFT#",ideaTokenId," owner",", which can be viewed by clicking on external URL of this NFT."));
    // for storing json file on-chaine using svg
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "', originalIdeaName,
                    '", "description": "',description,'", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),'",',
                    '"external_url": "',
                    openSeaLink_of_originalIdea,
                    '"}'
                )
            )
        )
    );

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    // Minting SecondaryNFT for the guest maker.
    _safeMint(publicKeyOf_GuestMaker, newItemId);
  
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, publicKeyOf_GuestMaker);
    
    // EMIT MAGICAL EVENTS.
    emit NewIdeaNFTMinted(msg.sender, newItemId);
  }
}