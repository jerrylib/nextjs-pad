import React, { useCallback, useEffect, useState } from 'react'
import { Input, Button, Row, Col, Divider, Collapse, Tag } from 'antd'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

// === Utils === //
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { get, isEmpty, map, reduce } from 'lodash'

// === Constants === //
import {
  STRATEGY_ABI,
  IERC20_ABI,
  VAULT_ABI,
  STRATEGY_ABI_USDI_v1_5_10,
  VAULT_ABI_USDI_V1_5_10,
  VAULT_BUFFER_V1_5_9,
  STRATEGY_ABI_ETHI_v1_5_10,
  VAULT_ABI_ETHI_V1_5_10,
  VAULT_ABI_ETHI_V1_5_9,
  VALUE_INTERPRETER_ABI,
  USDI_BASE_STRATEGY_ABI,
  PRICE_ORACLE_CONSUMER,
  ETH_BASE_STRATEGY,
  PRICE_ORACLE_ABI,
  CONVEX_IB_USDT_STRATEGY_ABI
} from '../abis/index'

const { TextArea } = Input
const { Panel } = Collapse

const RPCS = [
  { name: 'eth-mainnet', value: 'https://rpc.ankr.com/eth' },
  { name: 'bsc-mainnet', value: 'https://bsc-dataseed1.ninicoin.io' },
  { name: 'matic-mainnet', value: 'https://rpc-mainnet.maticvigil.com' },
  { name: 'qa-sg', value: 'https://rpc-qa-sg.bankofchain.io' },
  { name: 'qa02-sg', value: 'https://rpc-qa02-sg.bankofchain.io' },
  { name: 'qa03-sg', value: 'https://rpc-qa03-sg.bankofchain.io' },
  { name: 'qa04-sg', value: 'https://rpc-qa04-sg.bankofchain.io' },
  { name: 'stage-sg', value: 'https://rpc-stage-sg.bankofchain.io' }
]
const ADDRESSES = [
  {
    name: '生产vault地址-v1.5-eth',
    value: '0xd5C7A01E49ab534e31ABcf63bA5a394fF1E5EfAC'
  },
  {
    name: '生产vault地址-v1.5-bsc',
    value: '0x76609c83dD684F0D4c0F0c9849db0a1b5a96CAB2'
  },
  {
    name: '生产vault地址-v1.5-matic',
    value: '0xd3feAe6c4fdfDE73Bd2fE99c8fE6944904DAA68A'
  },
  {
    name: 'USDT-ETH',
    value: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  {
    name: 'USDT-BSC',
    value: '0x55d398326f99059fF775485246999027B3197955'
  },
  {
    name: 'USDT-MATIC',
    value: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  },
  {
    name: 'USDC-ETH',
    value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  {
    name: 'USDC-BSC',
    value: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
  },
  {
    name: 'USDC-MATIC',
    value: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
  },
  {
    name: 'DAI-ETH',
    value: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  {
    name: 'DAI-BSC',
    value: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3'
  },
  {
    name: 'DAI-MATIC',
    value: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  }
]
const ABIS = [
  { name: 'VAULT-USDi-v1.5.9', value: JSON.stringify(VAULT_ABI) },
  { name: 'VAULT-ETHi-v1.5.9', value: JSON.stringify(VAULT_ABI_ETHI_V1_5_9) },
  { name: 'VAULT-USDi-v1.5.10', value: JSON.stringify(VAULT_ABI_USDI_V1_5_10) },
  { name: 'VAULT-ETHi-v1.5.10', value: JSON.stringify(VAULT_ABI_ETHI_V1_5_10) },
  { name: 'IERC20', value: JSON.stringify(IERC20_ABI) },
  { name: 'STRATEGY-v1.5.9', value: JSON.stringify(STRATEGY_ABI) },
  {
    name: 'STRATEGY-USDi-v1.5.10',
    value: JSON.stringify(STRATEGY_ABI_USDI_v1_5_10)
  },
  {
    name: 'STRATEGY-ETHi-v1.5.10',
    value: JSON.stringify(STRATEGY_ABI_ETHI_v1_5_10)
  },
  { name: 'VAULT-BUFFER-v1.5.9', value: JSON.stringify(VAULT_BUFFER_V1_5_9) },
  { name: 'VALUE_INTERPRETER_ABI', value: JSON.stringify(VALUE_INTERPRETER_ABI) },
  { name: 'USDI_BASE_STRATEGY_ABI', value: JSON.stringify(USDI_BASE_STRATEGY_ABI) },
  { name: 'PRICE_ORACLE_CONSUMER', value: JSON.stringify(PRICE_ORACLE_CONSUMER) },
  { name: 'ETH_BASE_STRATEGY', value: JSON.stringify(ETH_BASE_STRATEGY) },
  { name: 'PRICE_ORACLE_ABI', value: JSON.stringify(PRICE_ORACLE_ABI) },
  { name: 'CONVEX_IB_USDT_STRATEGY_ABI', value: JSON.stringify(CONVEX_IB_USDT_STRATEGY_ABI) }
]

const useContract = (defaultRpc, defaultAddress, defaultBlockNumber, defaultAbi) => {
  const [rpc, setRpc] = useState('')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [blockNumber, setBlockNumber] = useState(-1)
  const [abi, setAbi] = useState('')
  const [balance, setBalance] = useState('0')

  const [inputDatas, setInputDatas] = useState({})
  const [outputDatas, setOutputDatas] = useState({})
  let abiJson = undefined
  try {
    abiJson = JSON.parse(abi)
  } catch (error) {
    abiJson = new Error('abi转换失败')
  }

  const fetchNewestBlockNumber = useCallback(() => {
    if (isEmpty(rpc)) return
    setFetchLoading(true)
    setBlockNumber(-1)
    const promise = new Promise(resolve => {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
        return web3.eth
          .getBlockNumber()
          .catch(() => -1)
          .then(resolve)
      } catch (error) {
        resolve(-1)
      }
    })
    promise.then(setBlockNumber).finally(() => {
      setTimeout(() => {
        setFetchLoading(false)
      }, 500)
    })
  }, [rpc])

  useEffect(() => {
    if (blockNumber > 0) return
    fetchNewestBlockNumber()
  }, [rpc, blockNumber, fetchNewestBlockNumber])

  const functionCall = index => {
    const abiItem = abiJson[index]
    if (isEmpty(abiItem)) return
    const { name, inputs, outputs } = abiItem
    const web3 = new Web3(rpc)
    const nextParams = map(inputs, (i, inputItemIndex) => {
      return get(inputDatas, `${name}.${inputItemIndex}`, '')
    })
    try {
      const vaultContract = new web3.eth.Contract(abiJson, address)
      vaultContract.methods[name](...nextParams)
        .call(undefined, blockNumber)
        .then(nextV => {
          const nextOutputDatas = reduce(
            outputs,
            (rs, outputItem, outputItemIndex) => {
              if (isEmpty(outputItem.name) || nextV[outputItem.name] === undefined) {
                rs[`${name}.${outputItemIndex}`] = nextV
              } else {
                rs[`${name}.${outputItemIndex}`] = nextV[outputItem.name]
              }
              return rs
            },
            {}
          )
          setOutputDatas({
            ...outputDatas,
            ...nextOutputDatas
          })
        })
    } catch (e) {
      const nextOutputDatas = reduce(
        outputs,
        (rs, i, outputItemIndex) => {
          rs[`${name}.${outputItemIndex}`] = e
          return rs
        },
        {}
      )
      setOutputDatas({
        ...outputDatas,
        ...nextOutputDatas
      })
    }
  }

  const InputArea = (
    <Row key="InputArea" gutter={[8, 8]}>
      <Col span={24}>
        <Input
          placeholder="rpc url"
          value={rpc}
          onChange={v => {
            setRpc(v.target.value)
            setBlockNumber(-1)
          }}
        />
        {map(RPCS, item => {
          const { name, value } = item
          return (
            <Tag
              key={name}
              icon={value === rpc && <CheckCircleOutlined />}
              color={value === rpc ? '#f50' : '#1890ff'}
              style={{ marginTop: '0.5rem', cursor: 'pointer' }}
              onClick={() => {
                setRpc(value)
                setBlockNumber(-1)
              }}
            >
              {name}
            </Tag>
          )
        })}
      </Col>
      <Col span={24}>
        <Input
          placeholder="contract address"
          value={address}
          onChange={v => setAddress(v.target.value)}
          addonAfter={`ETH Balance: ${new BigNumber(balance).toFormat()}`}
        />
        {map(ADDRESSES, item => {
          const { name, value } = item
          return (
            <Tag
              key={name}
              icon={value === address && <CheckCircleOutlined />}
              color={value === address ? '#f50' : '#1890ff'}
              style={{ marginTop: '0.5rem', cursor: 'pointer' }}
              onClick={() => setAddress(value)}
            >
              {name}
            </Tag>
          )
        })}
      </Col>
      <Col span={24}>
        <Input placeholder="block number" value={blockNumber} onChange={v => setBlockNumber(v.target.value)} />
        <Tag color={'#1890ff'} style={{ marginTop: '0.5rem', cursor: 'pointer' }} onClick={fetchNewestBlockNumber}>
          {fetchLoading && <LoadingOutlined style={{ marginRight: 10 }} />}
          Newest Block
        </Tag>
        <Tag color={'#1890ff'} style={{ marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setBlockNumber(blockNumber + 1)}>
          + 1
        </Tag>
        <Tag color={'#1890ff'} style={{ marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setBlockNumber(blockNumber - 1)}>
          - 1
        </Tag>
      </Col>
      <Col span={24}>
        <TextArea rows={6} value={abi} onChange={v => setAbi(v.target.value.replace(/ /g, '').replace(/\n/g, ''))} />
        {map(ABIS, item => {
          const { name, value } = item
          return (
            <Tag
              key={name}
              icon={value === abi && <CheckCircleOutlined />}
              color={value === abi ? '#f50' : '#1890ff'}
              style={{ marginTop: '0.5rem', cursor: 'pointer' }}
              onClick={() => setAbi(value)}
            >
              {name}
            </Tag>
          )
        })}
      </Col>
    </Row>
  )

  const FunctionArea = (
    <Collapse key={'FunctionArea'}>
      {map(abiJson, (item, index) => {
        const { name, inputs, outputs, type, stateMutability } = item
        if (type !== 'function') return
        const isWriteFun = stateMutability !== 'view' && stateMutability !== 'pure'
        return (
          <Panel header={`${name} (${isWriteFun ? 'Write' : 'Read'})`} key={index} collapsible={isWriteFun ? 'disabled' : ''}>
            <Button type="primary" onClick={() => functionCall(index)}>
              call
            </Button>
            {!isEmpty(inputs) && <Divider orientation="left">Inputs</Divider>}
            {map(inputs, (inputItem, inputItemIndex) => {
              return (
                <Input
                  key={`${name}.${inputItem.name}`}
                  style={{ marginTop: 8 }}
                  placeholder={`${name}.${inputItem.name} (${inputItem.type})`}
                  value={get(inputDatas, `${name}.${inputItemIndex}`, '')}
                  onChange={v =>
                    setInputDatas({
                      ...inputDatas,
                      [`${name}.${inputItemIndex}`]: v.target.value
                    })
                  }
                />
              )
            })}
            {!isEmpty(outputs) && <Divider orientation="left">Outputs</Divider>}
            {map(outputs, (outputItem, outputItemIndex) => {
              return (
                <p key={outputItemIndex}>
                  {`${name}.[${outputItemIndex}] (${outputItem.type})`}=
                  <span style={{ color: 'red', wordBreak: 'break-all' }}>{`${get(outputDatas, `${name}.${outputItemIndex}`, '')}`}</span>
                </p>
              )
            })}
          </Panel>
        )
      })}
    </Collapse>
  )

  useEffect(() => {
    if (isEmpty(address) || blockNumber < 0) return
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
      web3.eth.getBalance(address, blockNumber).then(setBalance)
    } catch (error) {
      console.log('balance fetch error=', error)
    }
  }, [address, rpc, blockNumber])

  useEffect(() => {
    if (isEmpty(rpc)) return
    sessionStorage.setItem('rpc', rpc)
  }, [rpc])

  useEffect(() => {
    if (blockNumber < 0) return
    sessionStorage.setItem('blockNumber', blockNumber)
  }, [blockNumber])

  useEffect(() => {
    if (isEmpty(address)) return
    sessionStorage.setItem('address', address)
  }, [address])

  useEffect(() => {
    if (isEmpty(abi)) return
    sessionStorage.setItem('abi', abi)
  }, [abi])

  useEffect(() => {
    setRpc(sessionStorage.getItem('rpc') || defaultRpc)
    setBlockNumber(sessionStorage.getItem('blockNumber') || defaultBlockNumber)
    setAddress(sessionStorage.getItem('address') || defaultAddress)
    setAbi(sessionStorage.getItem('abi') || defaultAbi)
  }, [])

  return { rpc, abi, address, abiJson, blockNumber, InputArea, FunctionArea }
}

export default useContract
