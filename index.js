// Source code to interact with smart contract
var ethUtil = require("ethereumjs-util");
var sigUtil = require("eth-sig-util");
var Web3 = require("web3");

if (window.ethereum) {
  try {
    // Request account access if needed
    window.ethereum.send("eth_requestAccounts");
  } catch (error) {
    console.log("Unable to connect to Metamask");
  }
}
//connection with local node
// const web3 = new Web3("https://data-seed-prebsc-1-s2.binance.org:8545");
// contractAddress and abi are setted after contract deploy
var contractAddress = "0x3b7B3a12EE153ecD71cC4BdB041a176C8BF7f2DB";

const kawaiiCoreAddress = "0x727370737F5fE7869180999bc6e792a9899DB15F";
var abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nft1155Address",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_weights",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_craftingPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "adminSignedData",
        type: "bytes",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "craftingItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IKawaiiRandomness",
        name: "_kawaiiRandomness",
        type: "address",
      },
    ],
    name: "setKawaiiRandomness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IBEP20",
        name: "_kawaiiToken",
        type: "address",
      },
    ],
    name: "setKawaiiToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_result",
        type: "bool",
      },
    ],
    name: "setSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IBEP20",
        name: "_kawaiiToken",
        type: "address",
      },
      {
        internalType: "contract IKawaiiRandomness",
        name: "_kawaiiRandomness",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CRAFTING_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isSigner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kawaiiRandomness",
    outputs: [
      {
        internalType: "contract IKawaiiRandomness",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kawaiiToken",
    outputs: [
      {
        internalType: "contract IBEP20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

//contract instance
// contract = new web3.eth.Contract(abi, contractAddress);

var nonce;
var CHAINID;
var adminSignedData;
var sign;
var callFunctionId = "0x8e6ac8f6";
var account = "0x68fD9bA8356547649547c0e6486a22A4c5237C96";
var privateKey =
  "55f5f2ee49da244087d94642dce9bf4341ec17e1d8c5dd590ca8c847329f0fa7";

// web3.eth.defaultAccount =
//   web3.eth.accounts.privateKeyToAccount(privateKey).address;

connectButton.addEventListener("click", function () {
  connect();
});

function connect() {
  if (typeof ethereum !== "undefined") {
    ethereum.enable().catch(console.error);
  }
}

var data = {
  domain: {
    chainId: "",
    name: "",
    verifyingContract: "",
    version: "1",
  },
  message: {},
  primaryType: "",
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
  },
};

function getSignature(
  chainId,
  name,
  contractAddress,
  primaryType,
  message,
  dataType,
  privateKey
) {
  let data_ = { ...data };
  data_.domain.chainId = chainId;
  data_.domain.name = name;
  data_.domain.verifyingContract = contractAddress;
  data_.primaryType = primaryType;
  data_.message = message;
  data_.types = { ...data_.types, ...dataType };

  let recover = sigUtil.recoverTypedSignature_v4({ data: data_, sig: sign });

  return recover;
}

userSigned.addEventListener("click", async function (event) {
  event.preventDefault();

  let encodehash = await web3.utils.soliditySha3(
    await web3.eth.abi.encodeParameters(
      [
        "address",
        "bytes4",
        "address",
        "uint256[]",
        "uint256[]",
        "uint256",
        "uint256",
      ],
      [
        contractAddress,
        callFunctionId,
        kawaiiCoreAddress,
        ["1"],
        [5],
        web3.utils.toWei("800000", "ether"),
        5,
      ]
    )
  );

  sign = await web3.eth.accounts.sign(encodehash, privateKey);

  adminSignedData = await web3.eth.abi.encodeParameters(
    ["uint8", "bytes32", "bytes32"],
    [sign.v, sign.r, sign.s]
  );

  alert("Ký thành công");
});

adminSigned.addEventListener("click", async function () {
  nonce = "0";
  CHAINID = 97;

  const msgParams = JSON.stringify({
    domain: {
      chainId: CHAINID,
      name: "KawaiiCrafting",
      verifyingContract: contractAddress,
      version: "1",
    },
    message: {
      nonce,
    },
    primaryType: "Data",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Data: [{ name: "nonce", type: "uint256" }],
    },
  });

  // recovered = getSignature(
  //   CHAINID,
  //   "",
  //   contractAddress,
  //   "Data",
  //   {
  //     adminSignedData,
  //     nonce,
  //   },
  //   {
  //     Data: [
  //       { name: "adminSignedData", type: "bytes" },
  //       { name: "nonce", type: "uint256" },
  //     ],
  //   },
  //   Buffer.from(privateKey, "hex")
  // );

  var from = account;
  var params = [account, msgParams];
  var method = "eth_signTypedData_v4";

  web3.currentProvider.send(
    {
      method,
      params,
      from,
    },
    function (err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error("ERROR", result);
      console.log("TYPED SIGNED:" + JSON.stringify(result.result));

      const recovered = sigUtil.recoverTypedSignature_v4({
        data: JSON.parse(msgParams),
        sig: result.result,
      });

      if (
        ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
      ) {
        alert("Successfully recovered signer as " + from);
      } else {
        alert(
          "Failed to verify signer when comparing " + result + " to " + from
        );
      }
    }
  );
});

craftingItem.addEventListener("click", async function () {
  event.preventDefault();

  const transaction = await contract.methods
    .craftingItem(
      kawaiiCoreAddress,
      ["1"],
      [5],
      web3.utils.toWei("800000", "ether"),
      5,
      account,
      adminSignedData,
      sign.v,
      sign.r,
      sign.s
    )
    .call({ from: account });

  console.log("transaction", transaction);
});
