// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/Brechtpd/base64/blob/main/base64.sol";
import "https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-core/console.sol";

contract IdeaNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /> <text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  
  struct Idea {
    string name;
    string description;
    string twitterURL;
    string description2;
  }

  Idea public idea = Idea("", "", "", "");

  event NewIdeaNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("IdeaNFT", "IDEA") {
    console.log("This will make you awesome Ideas Immutable!");
  }

  // Actual method to mint the IdeaNFT.
  function getIdeaDetails(string memory _name, string memory _description, string memory _twitterURL, string memory _description2) public 
  {
    require(bytes(_name).length > 0);
    require(bytes(_description).length > 0);
    require(bytes(_twitterURL).length > 0);
    require(bytes(_description2).length > 0);

    idea.name = _name;
    idea.description = _description;
    idea.description2 = _description2;
    idea.twitterURL = _twitterURL;

    // minting the IdeaNFT as per the information given by the user.
    makeAnIdeaNFT();
  }

  function getTokenId() public view returns(uint) {
    return _tokenIds.current();
  }

  function makeAnIdeaNFT() internal {

    uint256 newItemId = _tokenIds.current();
    
    string memory IdeaName = idea.name;
    string memory description = idea.description;
    string memory description2 = idea.description2;
    string memory twitterURL = idea.twitterURL;
    
    string memory baseNextLine = "<tspan class='strong em' font-family='Webdings' x ='50%' y='60%'>";
    string memory nextLineOfSVG = string(abi.encodePacked(baseNextLine, description, "</tspan>"));
    string memory finalSvg = string(abi.encodePacked(baseSvg, IdeaName, nextLineOfSVG, "</text></svg>"));

    // for storing json file on-chaine using svg
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "', IdeaName,
                    '", "description": "',description2,'", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),'",',
                    '"external_url": "',
                    twitterURL,
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

    _safeMint(msg.sender, newItemId);
  
    _setTokenURI(newItemId, finalTokenUri);
  
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    
    // EMIT MAGICAL EVENTS.
    emit NewIdeaNFTMinted(msg.sender, newItemId);
  }
}