import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/BuyMeACoffee.json";
import Layout from "../components/Layout";
import PulseLoader from "react-spinners/PulseLoader";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x889F8dc7aBB1e4533a18fa8Ce57Be1FB8e625dB4";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [withdrawToAddress, setWithdrawToAddress] = useState("");
  const [withdrawToAddressFieldValue, setWithdrawToAddressFieldValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onWithdrawToAddressChange = (event) => {
    setWithdrawToAddressFieldValue(event.target.value);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        const account = accounts[0];
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const clearFields = () => {
    setName("");
    setMessage("");
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const balance = await provider.getBalance(contractAddress);
        setBalance(balance);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async (amount) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        setIsLoading(true);
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(amount) }
        );

        await coffeeTxn.wait();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      clearFields();
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        setIsLoading(true);
        const memos = await buyMeACoffee.getMemos();
        const formattedMemos = memos.map((memo) => {
          const date = new Date(memo.timestamp * 1000);
          return {
            ...memo,
            timestamp: date.toLocaleDateString(),
          };
        });
        setMemos(formattedMemos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWithdrawAddress = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        const withdrawAddress = await buyMeACoffee.getWithdrawAddress();
        setWithdrawToAddress(withdrawAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateWithdrawToAddress = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        await buyMeACoffee.updateWithdrawAddress(withdrawToAddressFieldValue);

        setWithdrawToAddress(withdrawToAddressFieldValue);
        setWithdrawToAddressFieldValue("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawTips = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        setIsLoading(true);
        await buyMeACoffee.withdrawTips();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getBalance();
    getMemos();
    getWithdrawAddress();

    const { ethereum } = window;

    const onNewMemo = () => {
      getMemos();
      getBalance();
    };

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    <Layout className="max-w-lg mx-auto p-3 flex flex-col">
      <main className="pt-4 mb-10">
        {isLoading && (
          <>
            <div className="fixed w-screen h-screen bg-gray-500/50 left-0 top-0" />
            <PulseLoader
              color="#d4690b"
              loading={true}
              size={60}
              css={{
                position: "fixed",
                zIndex: 20,
                left: 0,
                right: 0,
                marginLeft: "auto",
                marginRight: "auto",
                width: "192px",
                top: "50%",
                transform: "translate(0, -100%)",
              }}
            />
          </>
        )}
        <h1 className="text-2xl text-orange font-bold text-center mb-7">Buy Tomster a Coffee!</h1>

        {currentAccount ? (
          <>
            <div className="mb-10">
              {withdrawToAddress && (
                <p className="text-center mb-2">
                  Withraw {ethers.utils.formatEther(balance.toString())} ETH to: {withdrawToAddress}
                </p>
              )}
              <button
                type="button"
                onClick={withdrawTips}
                className="block text-white w-full bg-brownDark mx-auto py-2 px-5 rounded-full text-sm transition-effect border-2 border-brownDark hover:bg-white hover:text-brownDark"
              >
                Withdraw funds
              </button>
            </div>

            <form className="mb-10">
              <div className="mb-5">
                <label htmlFor="withdrawToAddress" className="text-sm">
                  Update withdraw to address
                </label>
                <input
                  className="block w-full border border-brown rounded-sm p-2 text-sm"
                  id="withdrawToAddress"
                  type="text"
                  onChange={onWithdrawToAddressChange}
                  value={withdrawToAddressFieldValue}
                />
              </div>
              <button
                type="button"
                onClick={updateWithdrawToAddress}
                className="block text-white w-full bg-brownDark mx-auto py-2 px-5 rounded-full text-sm transition-effect border-2 border-brownDark hover:bg-white hover:text-brownDark"
              >
                Update withdraw to address
              </button>
            </form>

            <form className="mb-10">
              <div className="mb-5">
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <input
                  className="block w-full border border-brown rounded-sm p-2 text-sm"
                  id="name"
                  type="text"
                  onChange={onNameChange}
                  value={name}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm">
                  Send Tomster a message
                </label>
                <textarea
                  className="w-full border border-brown rounded-sm p-2 text-sm"
                  rows={3}
                  id="message"
                  onChange={onMessageChange}
                  value={message}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => buyCoffee("0.001")}
                  className="block text-white w-full bg-brownDark mx-auto py-2 px-5 rounded-full text-sm transition-effect border-2 border-brownDark hover:bg-white hover:text-brownDark mt-4"
                >
                  Buy coffee for 0.001 ETH
                </button>

                <button
                  type="button"
                  onClick={() => buyCoffee("0.003")}
                  className="block text-white w-full bg-brownDark mx-auto py-2 px-5 rounded-full text-sm transition-effect border-2 border-brownDark hover:bg-white hover:text-brownDark mt-4"
                >
                  Buy coffee for 0.003 ETH
                </button>
              </div>
            </form>
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="block text-white w-full bg-brownDark mx-auto py-2 px-5 rounded-full text-sm transition-effect border-2 border-brownDark hover:bg-white hover:text-brownDark mt-4"
          >
            {" "}
            Connect your wallet{" "}
          </button>
        )}

        {currentAccount && !!memos.length && (
          <h1 className="text-xl text-orange font-semibold text-center mb-3">Memos received</h1>
        )}

        {currentAccount &&
          memos.map((memo, idx) => {
            return (
              <div key={idx} className="border border-brown rounded-md p-3 mb-5 bg-white/80">
                <p className="text-sm font-bold mb-2">"{memo.message}"</p>
                <p className="text-sm">
                  From: {memo.name} at {memo.timestamp.toString()}
                </p>
              </div>
            );
          })}
      </main>

      <footer className="mt-auto">
        <a
          href="https://alchemy.com/?a=roadtoweb3weektwo"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-center leading-relaxed mb-2"
        >
          Created by @0xTomster for Alchemy's Road to Web3 lesson two!
        </a>
      </footer>
    </Layout>
  );
}
