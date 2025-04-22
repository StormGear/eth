import { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { ethers } from "ethers";

interface library {
  provider: string;
}

function App() {
  const [walletAddressWeb3, setWalletAddressWeb3] = useState<string>('');
  const [walletAddressEthers, setWalletAddressEthers] = useState<string>('');
  const [balanceEthers, setBalanceEthers] = useState<string>('');
  const [balanceWeb3, setBalanceWeb3] = useState<string>('');
  // const [token, setToken] = useState<string>('');
  const [activeScreen, setActiveScreen] = useState<library>(
    {
      provider: 'web3',}
  );

  const connectWalletWithWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setWalletAddressWeb3(account);

        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalanceWeb3(balanceEth);
      } catch (err) {
        console.error('Wallet connection error:', err);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const connectWalletWithEthers = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    console.log('window.ethereum', window.ethereum);
    let provider;
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      provider = ethers.getDefaultProvider();
      return;
    }
    // Create a new instance of ethers.js provider
  
    try {
      let signer = null;

    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
     provider = new ethers.BrowserProvider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
       signer = await provider.getSigner();

      // Request account access if needed
      await provider.send("eth_requestAccounts", []);
      // Get the user's Ethereum address
      const address = await signer.getAddress();
    
      setWalletAddressEthers(address);

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalanceEthers(balanceEth);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      {/* Navbar */}
      <nav className="w-full flex justify-center space-x-4 p-4">
        <button
          onClick={() => setActiveScreen({ provider: 'web3' })}
          className={`px-4 py-2 rounded-xl cursor-pointer ${
            activeScreen.provider === 'web3'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors font-medium`}
        >
          Web3.js
        </button>
        <button
          onClick={() => setActiveScreen({ provider: 'ethers' })}
          className={`px-4 py-2 rounded-xl cursor-pointer ${
            activeScreen.provider === 'ethers'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors font-medium`}
        >
          Ethers.js
        </button>
      </nav>

      <h1 className="text-3xl font-bold mb-6 mt-40">🔗 Connect MetaMask Wallet with {activeScreen.provider === 'ethers' ? 'Ethers.js' : 'Web3.js'}</h1>

        <>
          {(() => {
            switch (activeScreen.provider) {
              case 'web3':
                return (
                  <>
                  <button
                  onClick={connectWalletWithWeb3}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
                >
                  Connect Wallet
                </button>
                  <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-md w-full max-w-md text-left">
                    <p className="mb-2">
                      <span className="font-semibold">Address:</span> {walletAddressWeb3}
                    </p>
                    <p>
                      <span className="font-semibold">Balance:</span> {balanceWeb3} ETH
                    </p>
                  </div>
                  </>
                );
              case 'ethers':
                return (
                  <>
                  <button
                  onClick={connectWalletWithEthers}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
                >
                  Connect Wallet
                </button>
                  <div className="mt-6 p-4 bg-white/10 rounded-lg shadow-md w-full max-w-md text-left">
                    <p className="mb-2">
                      <span className="font-semibold">Address:</span> {walletAddressEthers}
                    </p>
                    <p>
                      <span className="font-semibold">Balance:</span> {balanceEthers} ETH
                    </p>
                  </div>
                  </>
                );
              default:
                return null;
            }
          })()}
        </>
    </div>
  );
}

export default App;