// === Utils === //
import abiDecoder from "abi-decoder";

// === Constants === //
import {
  IERC20_ABI,
  ONINCH_ABI,
  STRATEGY_ABI,
  VAULT_ABI,
} from "./../abis/index";

abiDecoder.addABI(VAULT_ABI);
abiDecoder.addABI(IERC20_ABI);
abiDecoder.addABI(STRATEGY_ABI);
abiDecoder.addABI(ONINCH_ABI);

export const decodeLogs = (receipt = { logs: [] }) => {
  return abiDecoder.decodeLogs(receipt.logs);
};

export const decodeMethod = (data) => {
  return abiDecoder.decodeMethod(data);
};
