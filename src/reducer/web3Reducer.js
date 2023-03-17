import React, { createContext, useCallback, useReducer } from 'react'

// === Utils === //
import Web3 from 'web3'
import { isEmpty, last, map } from 'lodash'

// === Constants === //
import { WEB3_INIT, UPDATE_BLOCK_NUMBER, LOAD_MORE, UPDATE_BLOCK_DETAIL, UPDATE_HASH_DETAIL } from './actions'

const initValue = {
  web3Instance: null,
  blockNumber: -1,
  blockList: [],
  currentBlock: -1,
  currentHash: null
}

export const Web3Context = createContext({})

const array = new Array(10)

export const ReducerContextProvider = props => {
  const reducer = useCallback((preState, action) => {
    const { type, payload } = action
    switch (type) {
      case WEB3_INIT: {
        if (isEmpty(payload)) return preState
        const web3 = new Web3(new Web3.providers.HttpProvider(payload))
        return {
          ...preState,
          web3Instance: web3,
          blockList: []
        }
      }

      case UPDATE_BLOCK_NUMBER: {
        return {
          ...preState,
          blockNumber: payload,
          blockList: []
        }
      }
      case UPDATE_BLOCK_DETAIL: {
        const { blockList } = preState
        const nextBlockList = map(blockList, i => {
          if (i.id === payload.id) {
            return payload
          }
          return i
        })
        return {
          ...preState,
          blockList: nextBlockList,
          currentBlock: payload.id
        }
      }
      case LOAD_MORE: {
        const startBlockNumber = isEmpty(preState.blockList) ? preState.blockNumber : last(preState.blockList).id - 1
        const blockList = preState.blockList.concat(
          map(array, (i, index) => {
            return {
              id: startBlockNumber - index,
              isInit: false
            }
          })
        )
        return {
          ...preState,
          blockList,
          currentBlock: -1
        }
      }
      case UPDATE_HASH_DETAIL: {
        const { blockList } = preState
        const { id, hash, decodeData } = payload
        const nextBlockList = map(blockList, i => {
          if (i.id === id) {
            const nextDetails = map(i.details, ii => {
              if (ii.hash === hash) {
                return {
                  ...ii,
                  decodeData
                }
              }
              return ii
            })
            return {
              ...i,
              details: nextDetails
            }
          }
          return i
        })
        return {
          ...preState,
          currentHash: hash,
          blockList: nextBlockList
        }
      }

      default:
        return preState
    }
  }, [])
  const [state, dispatch] = useReducer(reducer, initValue)

  return <Web3Context.Provider value={{ state, dispatch }}>{props.children}</Web3Context.Provider>
}
