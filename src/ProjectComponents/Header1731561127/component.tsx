
import React from 'react';
import { ethers } from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenA, setTokenA] = React.useState('');
  const [tokenB, setTokenB] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [poolResult, setPoolResult] = React.useState('');
  const [tickSpacing, setTickSpacing] = React.useState('');
  const [getPoolResult, setGetPoolResult] = React.useState('');
  const [parameters, setParameters] = React.useState<any>(null);

  const contractAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const chainId = 1; // Ethereum Mainnet

  const contractABI = [
    {
      name: "createPool",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenA", type: "address" },
        { name: "tokenB", type: "address" },
        { name: "fee", type: "uint24" }
      ],
      outputs: [{ name: "pool", type: "address" }]
    },
    {
      name: "feeAmountTickSpacing",
      stateMutability: "view",
      inputs: [{ name: "", type: "uint24" }],
      outputs: [{ name: "", type: "int24" }]
    },
    {
      name: "getPool",
      stateMutability: "view",
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
        { name: "", type: "uint24" }
      ],
      outputs: [{ name: "", type: "address" }]
    },
    {
      name: "parameters",
      stateMutability: "view",
      inputs: [],
      outputs: [
        { name: "factory", type: "address" },
        { name: "token0", type: "address" },
        { name: "token1", type: "address" },
        { name: "fee", type: "uint24" },
        { name: "tickSpacing", type: "int24" }
      ]
    }
  ];

  React.useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        const uniswapContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(uniswapContract);
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    await provider.send("eth_requestAccounts", []);
  };

  const checkAndSwitchNetwork = async () => {
    if (!provider) return;
    const network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  };

  const createPool = async () => {
    if (!contract) return;
    try {
      await connectWallet();
      await checkAndSwitchNetwork();
      const tx = await contract.createPool(tokenA, tokenB, fee);
      const receipt = await tx.wait();
      setPoolResult(receipt.events[0].args.pool);
    } catch (error) {
      console.error("Error creating pool:", error);
      setPoolResult("Error: " + (error as Error).message);
    }
  };

  const getFeeAmountTickSpacing = async () => {
    if (!contract) return;
    try {
      await connectWallet();
      await checkAndSwitchNetwork();
      const result = await contract.feeAmountTickSpacing(fee);
      setTickSpacing(result.toString());
    } catch (error) {
      console.error("Error getting fee amount tick spacing:", error);
      setTickSpacing("Error: " + (error as Error).message);
    }
  };

  const getPoolAddress = async () => {
    if (!contract) return;
    try {
      await connectWallet();
      await checkAndSwitchNetwork();
      const result = await contract.getPool(tokenA, tokenB, fee);
      setGetPoolResult(result);
    } catch (error) {
      console.error("Error getting pool address:", error);
      setGetPoolResult("Error: " + (error as Error).message);
    }
  };

  const getParameters = async () => {
    if (!contract) return;
    try {
      await connectWallet();
      await checkAndSwitchNetwork();
      const result = await contract.parameters();
      setParameters(result);
    } catch (error) {
      console.error("Error getting parameters:", error);
      setParameters("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">UniswapV3Factory Interaction</h1>
      
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Create Pool</h2>
        <input
          type="text"
          placeholder="Token A Address"
          className="border p-2 mr-2 rounded"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token B Address"
          className="border p-2 mr-2 rounded"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
        />
        <input
          type="text"
          placeholder="Fee"
          className="border p-2 mr-2 rounded"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button onClick={createPool} className="bg-blue-500 text-white p-2 rounded">Create Pool</button>
        {poolResult && <p className="mt-2">Pool Address: {poolResult}</p>}
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Fee Amount Tick Spacing</h2>
        <input
          type="text"
          placeholder="Fee"
          className="border p-2 mr-2 rounded"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button onClick={getFeeAmountTickSpacing} className="bg-blue-500 text-white p-2 rounded">Get Tick Spacing</button>
        {tickSpacing && <p className="mt-2">Tick Spacing: {tickSpacing}</p>}
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Get Pool</h2>
        <input
          type="text"
          placeholder="Token A Address"
          className="border p-2 mr-2 rounded"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token B Address"
          className="border p-2 mr-2 rounded"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
        />
        <input
          type="text"
          placeholder="Fee"
          className="border p-2 mr-2 rounded"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button onClick={getPoolAddress} className="bg-blue-500 text-white p-2 rounded">Get Pool</button>
        {getPoolResult && <p className="mt-2">Pool Address: {getPoolResult}</p>}
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Parameters</h2>
        <button onClick={getParameters} className="bg-blue-500 text-white p-2 rounded">Get Parameters</button>
        {parameters && (
          <div className="mt-2">
            <p>Factory: {parameters.factory}</p>
            <p>Token0: {parameters.token0}</p>
            <p>Token1: {parameters.token1}</p>
            <p>Fee: {parameters.fee.toString()}</p>
            <p>Tick Spacing: {parameters.tickSpacing.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
