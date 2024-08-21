import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import TBook from "../components/TBook";
import axios from "axios";
import endpoints from "../auth/endpoints";
import { useAuth } from "../auth/useSessionStorage";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Abi, parseEther } from "viem";

// To be loaded
const contractAddress = "0x9d79c1feacfc8db2b0d850931262fe2849b30921";
// const TBookFactoryABI = TBookFactory.abi;
const TBookFactoryABI: Abi = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "tbsn",
      "type": "uint256"
    }
  ],
  "name": "mintCopy",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},];

interface RouteParams {
    tbsn: string;
    [key: string]: string | undefined;
}

interface PriceData {
  priceETH: string;
  priceUSD: string
};

const CollectPage: React.FC = () => {

    const { address, isConnected } = useAccount();
    const { tbsn } = useParams<RouteParams>();
    const [tbookData, setTBookData] = useState<any>(null);
    const { session, isLoggedIn, login } = useAuth();
    const { signMessageAsync } = useSignMessage();
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { openConnectModal } = useConnectModal();
    const [refreshDate, setRefreshDate] = useState(0);
    const [prices, setPrices] = useState<PriceData>({priceETH: "--", priceUSD: "--"}); // price in ETH

    const [isSpinning, setIsSpinning] = useState(false);

    const handleRefreshClick = async () => {
        setIsSpinning(true);
        setTimeout(async () => {
          await getPrice();
          setIsSpinning(false);
        }, 1000);
      };

    const getTBookData = async (tbsn: string) => {
        const response = await axios.get(endpoints.getPublicationAPI(tbsn));
        const data = response.data;
        setTBookData(data);
    }

    const buyAction = async () => {
      if (isLoggedIn && isConnected) {
        console.log("Buy login!!");
        mintNFT();
        return
      } else {
        console.log("Not Logged In");
        if (address && isConnected) {
          login(address, signMessageAsync);
        } else if (openConnectModal) {
          openConnectModal();
        }
      }
    }

    const mintNFT = async () => {
      console.log("Minting NFT");
      const price = document.getElementById("payAmount") as HTMLInputElement;
      console.log("Price: ", parseEther(price.value), tbsn);
      try {
        writeContract({
          address: contractAddress,
          abi: TBookFactoryABI,
          functionName: 'mintCopy',
          args: [BigInt(tbsn || "1")],
          value: parseEther(price.value),
        });
      } catch (error) {
        console.log("Error minting NFT: ", error);
      }

    }


    const getPrice = async () => {
        if (Date.now() - refreshDate < 1000 || !tbsn) {
          return;
        }
        try {
          const response = await axios.get(endpoints.getPriceAPI(tbsn));
          const data: PriceData = response.data;
          setPrices(data);
          setRefreshDate(Date.now());
          const priceInput = document.getElementById("payAmount") as HTMLInputElement;
          priceInput.value = data.priceETH;
        } catch (error) {
          console.log("Error getting price: ", error);
        }
    }

    useEffect(() => {
        getTBookData(tbsn || "0");
        getPrice();
    }, []);

    useEffect(() => {
        console.log("CollectPage Session: ", session);
        console.log(session?.address);
        const receiveAddress = document.getElementById("receiveAddress") as HTMLInputElement;
        if (receiveAddress) {
            receiveAddress.value = (session) ? session.address : "";
        }
    }, [session]);

    const txHash = null;


    return (
      <div className='vw-100 vh-100 d-flex flex-column'>
          <NavBar />
          <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1">
            <h1 className="m-3 my-5 pt-3 text-center">Collect TBook NFT</h1>
            <div className="row w-100 d-flex justify-content-center">
            <div className="col-md-6 d-flex justify-content-center">
              <TBook
                tbsn={tbsn}
                short={true}
                title={tbookData?.title}
                link={"/view/" + tbsn}
                blurb={tbookData?.blurb}
                author={tbookData?.author}
                coverImage={tbookData?.coverImage}
              />
              </div>
            
            <div className="col-md-6 d-flex justify-content-center">
              <input
                type="text"
                className="form-control"
                value={address || ""}
                style={{ display: "none" }}
              />
              <div className="card my-4 p-4 mx-0 d-flex flex-grow-1">
                <div className="h2 mb-4">
                  TBook #{tbsn}
                  <i
                    className="iconify text-primary mx-auto"
                    // data-icon="bxs:badge-check"
                  ></i>{" "}
                </div>
                <p className="h6 text-muted">Current Floor Price</p>
                <div className="container d-flex flex-row my-4 justify-content-center">
                  <i
                    className="iconify text-center my-auto"
                    data-icon="mdi:ethereum"
                    style={{ fontSize: 40, width: 75 }}
                  ></i>
                  <div className="col-3 h3 mx-0 my-auto">
                    {prices ? prices.priceETH : "--"}
                  </div>
                  <div className="text-muted mx-3 col-3 my-auto">
                    ${prices ? prices.priceUSD : "--"} USD
                  </div>
                  <a
                    className="btn btn-sm btn-primary col-3 my-auto d-flex align-items-center justify-content-center"
                    style={{ borderRadius: 25, width: 'auto', padding: '0.5rem 0.5rem' }}
                    onClick={handleRefreshClick}
                  >
                    <span
                      className={`d-flex px-0 align-items-center justify-content-center ${isSpinning ? "spinner-border spinner-border-sm" : ""}`}
                    >
                      <i className="fa fa-rotate"
                      style={isSpinning ? { display: "none" } : { fontSize: 18 }}
                      ></i>
                    </span>
                  </a>
                </div>
                <button
                  className="btn btn-warning dropdown-toggle w-100"
                  type="button"
                  style={{ borderRadius: 25, fontSize: 20 }}
                  data-bs-toggle="collapse"
                  data-bs-target="#checkoutCollapse"
                  aria-expanded="false"
                  aria-controls="#checkoutCollapse"
                >
                  <i
                    className="fa fa-book-bookmark mx-3"
                    style={{ fontSize: 20 }}
                  ></i>
                  Collect
                </button>
                <div className="collapse" id="checkoutCollapse">
                  <p className="h5 mb-3 mt-5">Receiving Address</p>
                  <input
                    id="receiveAddress"
                    disabled={!address}
                    className="form form-control"
                    type="text"
                    defaultValue={address || ""}
                  />
                  <p className="h5 mb-3 mt-5">Payment Amount</p>
                  <div className="row w-100">
                    <i
                      className="iconify text-center my-auto"
                      data-icon="mdi:ethereum"
                      style={{ fontSize: 20, width: 50 }}
                    ></i>
                    <input
                      id="payAmount"
                      className="form form-control col-6 w-50"
                      type="number"
                      step="0.001"
                      disabled={!address}
                      defaultValue={prices ? prices.priceETH : 0}
                    />
                    <button
                      id="buyButton"
                      className={`btn btn-${isLoggedIn && isConnected ? 'success' : 'warning'} w-25 mx-auto px-0`}
                      style={{ borderRadius: 25 }}
                      onClick={buyAction}
                    >
                      {isLoggedIn && isConnected ? "Buy" : "Login"}
                    </button>
                    {/* <p className="text-danger my-3 mx-3">{buyError}</p>
                    <p className="text-success my-3 mx-3">{buyStatus}</p> */}
                    <a
                      className="text-muted my-3 mx-3"
                      href={"#"}
                      style={{ fontSize: 14 }}
                    >
                      {hash && <div>Transaction Hash: {hash}</div>}
                    </a>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default CollectPage;
