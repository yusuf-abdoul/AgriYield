import { Client, TokenCreateTransaction, TokenType, TokenSupplyType, PrivateKey, TokenId } from "@hashgraph/sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const OPERATOR_ID = process.env.HEDERA_OPERATOR_ID!;
  const OPERATOR_KEY = PrivateKey.fromStringECDSA(process.env.HEDERA_OPERATOR_KEY!);

  if (!OPERATOR_ID || !OPERATOR_KEY) {
    throw new Error("Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY in .env");
  }

  const client = Client.forTestnet();
  client.setOperator(OPERATOR_ID, OPERATOR_KEY);

  console.log("Creating hUSDT token on Hedera testnet...");

  const tx = await new TokenCreateTransaction()
    .setTokenName("Hedera USD Tether")
    .setTokenSymbol("hUSDT")
    .setDecimals(6)
    .setInitialSupply(0)
    .setTreasuryAccountId(OPERATOR_ID)
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(OPERATOR_KEY)
    .setKycKey(OPERATOR_KEY)
    .freezeWith(client);

  const signedTx = await tx.sign(OPERATOR_KEY);
  const submitTx = await signedTx.execute(client);
  const receipt = await submitTx.getReceipt(client);
  const tokenId = receipt.tokenId!;

  console.log("✅ Created token:", tokenId.toString());
  console.log("   Solidity address:", tokenId.toEvmAddress());

  // Save output to file
  const outPath = path.join(__dirname, "../artifacts/husdt.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({
      tokenId: tokenId.toString(),
      solidityAddress: tokenId.toEvmAddress()
    }, null, 2)
  );

  console.log("Saved token info to artifacts/husdt.json");
}

main().catch((err) => {
  console.error("Error creating token:", err);
  process.exit(1);
});

