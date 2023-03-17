// === Utils === //
import abiDecoder from 'abi-decoder'

// === Constants === //
import {
  IERC20_ABI,
  ONINCH_ABI,
  STRATEGY_ABI,
  VAULT_ABI,
  STRATEGY_ABI_USDI_v1_5_10,
  VAULT_ABI_USDI_V1_5_10,
  VAULT_BUFFER_V1_5_9,
  STRATEGY_ABI_ETHI_v1_5_10,
  VAULT_ABI_ETHI_V1_5_10,
  VAULT_ABI_ETHI_V1_5_9
} from './../abis/index'

abiDecoder.addABI(VAULT_ABI)
abiDecoder.addABI(IERC20_ABI)
abiDecoder.addABI(STRATEGY_ABI)
abiDecoder.addABI(ONINCH_ABI)
abiDecoder.addABI(STRATEGY_ABI_USDI_v1_5_10)
abiDecoder.addABI(VAULT_ABI_USDI_V1_5_10)
abiDecoder.addABI(VAULT_BUFFER_V1_5_9)
abiDecoder.addABI(STRATEGY_ABI_ETHI_v1_5_10)
abiDecoder.addABI(VAULT_ABI_ETHI_V1_5_10)
abiDecoder.addABI(VAULT_ABI_ETHI_V1_5_9)

export const decodeLogs = (receipt = { logs: [] }) => {
  return abiDecoder.decodeLogs(receipt.logs)
}

export const decodeMethod = data => {
  return abiDecoder.decodeMethod(data)
}
