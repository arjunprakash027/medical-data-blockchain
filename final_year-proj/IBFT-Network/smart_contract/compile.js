const fs = require("fs").promises;
const solc = require("solc");

async function main() {
  try {
    // Load the contract source code
    const sourceCode = await fs.readFile("SimpleStorage.sol", "utf8");
    // Compile the source code and retrieve the ABI and bytecode
    const { abi, bytecode } = compile(sourceCode, "SimpleStorage");
    // Store the ABI and bytecode into a JSON file
    const artifact = JSON.stringify({ abi, bytecode }, null, 2);
    await fs.writeFile("SimpleStorage.json", artifact);
    console.log("Compilation successful. Artifacts saved to SimpleStorage.json");
  } catch (error) {
    console.error("Compilation failed:", error.message);
    process.exit(1);
  }
}

function compile(sourceCode, contractName) {
  // Create the Solidity Compiler Standard Input and Output JSON
  const input = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };

  // Parse the compiler output to retrieve the ABI and bytecode
  const output = solc.compile(JSON.stringify(input));
  
  const parsedOutput = JSON.parse(output);

  if (!parsedOutput.contracts || !parsedOutput.contracts.main || !parsedOutput.contracts.main[contractName]) {
    throw new Error(`Contract compilation failed. Contract ${contractName} not found.`);
  }

  const artifact = parsedOutput.contracts.main[contractName];
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

main();
