# wax-anchor-login
Demo webapp for Anchor wallet authentication and showing Atomic Assets in EOSIO based Blockchain - WAX

To run the web-app,

```
cd wax-anchor-login
npm install
npm run start
```

then, login with Anchor Authentication in Testnet, note that wax cloud wallet isn't included here.

## For displaying Assets ( Wax NFTs from you inventory ), all you have to do is input an collection name or your own collection name by the atomicassets testnet api.

```typescript
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

```
