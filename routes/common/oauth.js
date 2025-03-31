const { AuthClientTwoLegged } = require("forge-apis");

const config = require("../../config");

// Tokens are auto-refreshed, keeping clients in simple cache
let cache = {};

// Since we got 3 calls at the first page loading, let's initialize this one now,
// to avoid concurrent requests.
getClient(/*config.scopes.internal*/);

async function getClient(scopes) {
  scopes = scopes || config.scopes.internal;
  const key = scopes.join("+");
  if (cache[key]) return cache[key];

  try {
    const { client_id, client_secret } = config.credentials;
    let client = new AuthClientTwoLegged(
      client_id,
      client_secret,
      scopes || config.scopes.internal,
      true
    );
    let credentials = await client.authenticate();
    cache[key] = client;
    console.log(`OAuth2 client created for ${key}`);
    return client;
  } catch (ex) {
    return null;
  }
}

module.exports = {
  getClient,
};
