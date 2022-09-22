import React from 'react'
import { Row, Col } from 'antd'

// === Styles === //
import { IERC20_ABI } from '../abis'

// === Hooks === //
import { useContract } from '../hooks'

const defaultRpc = 'https://rpc.ankr.com/eth'
const defaultContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7' // 0x3416cF6C708Da44DB2624D63ea0AAef7113527C6
const defaultBlockNumber = -1
const defaultAbi = JSON.stringify(IERC20_ABI)

export default function Index() {
  const { abiJson, InputArea, FunctionArea } = useContract(defaultRpc, defaultContractAddress, defaultBlockNumber, defaultAbi)

  return (
    <Row gutter={[12, 12]} style={{ padding: 24 }}>
      <Col span={24}>{InputArea}</Col>
      {abiJson instanceof Error ? (
        <Col span={24}>
          <p style={{ color: 'red' }}>abi解析失败！</p>
        </Col>
      ) : (
        <Col span={24}>{FunctionArea}</Col>
      )}
    </Row>
  )
}
