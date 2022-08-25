
import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./dashboard.scss";

import { useNavigate, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DropDown from "../DropDown";

import * as waxjs from "@waxio/waxjs/dist";

import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import { headerLinkData } from "../../config/constant";

import './style.css';

export interface NFTShow {
  setWalletSession: any,
  Account: any,
  setAccount: any,
  userBalance: any,
  loginFlag: any,
  depositAssets: any,
}


// testnet endpoint - https://waxtestnet.greymass.com
// chainID - f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12

export default function MiddleAppBar({ setWalletSession, Account, setAccount, userBalance, loginFlag, depositAssets }: NFTShow) {

  let wallet_session:any;

  const navigate = useNavigate();
  const location = useLocation();
  let totalNFTs: any = [];
  const pages = ['Inventory', 'Characters', 'Buildings', 'Leaderboard', 'Daily Winners', 'Open Packs', 'Stake Assets'];
  const [headerActive, setHeaderActive] = useState(headerLinkData.characters);

  const endpoint = "https://waxtestnet.greymass.com";
  const chainID = "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";
  
  let display_nft = false;
  let loggedIn = false;
  const schema = "characters";
  const identifier = 'main'
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<string>("");

  // using anchor for testnet
  let walletType = "Anchor";

  const wax = new waxjs.WaxJS({
    rpcEndpoint: endpoint
  });
  const main = async () => {

    if (loggedIn) {

    } else
      await autoLogin();
  }

  const autoLogin = async () => {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {

      setAccount(wax.userAccount);
      let pubKeys = wax.pubKeys;
      let str = 'User: ' + wax.userAccount;
      console.log(str);
      loggedIn = true;
      await main();
    }
  }


  const login = async () => {
    try {
      if (!loggedIn) {
        let wallet1_userAccount = await wallet_login();
        setAccount(wallet1_userAccount);
        loggedIn = true;
        let depositassets = await GetAssets(wallet1_userAccount);

        let isWork = await wax.rpc
          .get_currency_userBalance("eosio.token", Account, "wax")
          .then((res) => {
            return true;
          })
          .catch((err) => {
            console.log("err", err);
            return false;
          });

      }
    } catch (e) {
    }
  }

  const dapp = "stakingdapp";

  async function wallet_login() {
    var wallet_Account;
    const transport = new AnchorLinkBrowserTransport();
    const anchorLink = new AnchorLink({
      transport,
      chains: [{
        chainId: chainID,
        nodeUrl: endpoint,
      }],
    }); 
    if (walletType == "Anchor") {
      var sessionList = await anchorLink.listSessions(dapp);
      if (sessionList && sessionList.length > 0) {
        wallet_session = await anchorLink.restoreSession(dapp);
      } else {
        wallet_session = (await anchorLink.login(dapp)).session;
      }
      wallet_Account = String(wallet_session.auth).split("@")[0];
      let auth = String(wallet_session.auth).split("@")[1];
      let anchorAuth = auth;
    } else {
      wallet_Account = await wax.login();
      wallet_session = wax.api;
      let anchorAuth = "active";
    }
    setWalletSession(wallet_session);
    
    return wallet_Account;
  }

  // getting assets through atomicassets testnet api
  const GetAssets = async (account:any) => {
    let results = [];
    var path = "atomicassets/v1/assets?owner=" + account + "&page=1&limit=1000&order=desc&sort=asset_id";
    const response = await fetch("https://" + "test.wax.api.atomicassets.io/" + path, {
      headers: {
        "Content-Type": "text/plain"
      },
      method: "POST",
    });


    const body = await response.json();
    if (body.data.length != 0)
      results = body.data;

    console.log('responsive = = = = =', results);

    depositAssets(results);
    return results;
  }

  const logout = async () => {
    loggedIn = false;
    display_nft = false;
    setAccount("");
  }

  const onClickLogin = () => {
    login();
  }

  const loginClick = () => {
    navigate("/manage-wallet");
  }

  const tokenStyle = {
    backgroundImage: `url('../../background.jpg')`,
    width: '60px',
    height: '60px',
    backgroundSize: "100%",
    marginRight:"8px",
    marginLeft:"8px",
  }

  const loginBtnStyle = {
      backgroundColor: '#2edada',
      color: '#189648',
      paddingLeft: "30px",
      paddingRight: "30px",
      fontWeight: 500,
      fontSize: "1.4rem",
      borderRadius: "10px",
      padding: '16px',
  }

  return (
    <Box className = "Navbar" sx={{ flexGrow: 1 }} style={{ position: "sticky", top: 0, zIndex: "100" }}>
      <AppBar position="static">
        <Toolbar sx = {{justifyContent: "space-between" }}>
          <Typography className="logo" variant="h6" component="div" >
            <div className="logo-main" >
              <h1>Decentralized Application Logo</h1>
            </div>
          </Typography>

          <Box sx={{ display: { xs: 'flex', md: 'flex' }, marginLeft: 3, }}>
            <button
              className={showDropDown ? "active" : undefined}
              onClick={onClickLogin}
              style={loginBtnStyle}
            >
              {Account!=""?Account:"Login"}
          </button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
