import axios from 'axios'

const API_SERVER = 'https://service-qa02-sg.bankofchain.io'
export const getStrategyApyDetails = (chainId, vaultAddress, strategyAddress, offset = 0, limit = 20) => {
  const nextParams = {
    strategyAddress,
    offset,
    limit
  }
  const url = `${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/verifiedApy/daily`
  return axios
    .get(url, {
      params: nextParams
    })
    .then(resp => resp.data)
}

export const getStrategyApysOffChain = (params, offset = 0, limit = 20) => {
  try {
    const nextParams = {
      offset,
      limit,
      ...params
    }
    return axios
      .get(`${API_SERVER}/officialApy`, {
        params: nextParams
      })
      .then(resp => resp.data)
  } catch (error) {
    return {
      content: []
    }
  }
}

export const getBaseApyByPage = (params, offset = 0, limit = 20) => {
  const { chainId, vaultAddress, ...restParams } = params
  return axios
    .get(`${API_SERVER}/chains/${chainId}/vaults/${vaultAddress}/verifiedApy`, {
      params: {
        offset,
        limit,
        ...restParams
      }
    })
    .then(resp => resp.data)
}
