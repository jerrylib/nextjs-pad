import React, { useCallback, useState } from 'react'

// === Components === //
import { Input, Row, Col, Space, Descriptions } from 'antd'

// === Utils === //
import * as ethers from 'ethers'

const { BigNumber, utils } = ethers

const Demo1 = () => {
  const [value, setValue] = useState('')

  let bigNumberValue, parseUnits, parseEther
  try {
    bigNumberValue = BigNumber.from(value)
  } catch (error) {
    bigNumberValue = BigNumber.from(0)
  }

  try {
    parseUnits = utils.parseUnits(value, 6)
  } catch (error) {
    parseUnits = BigNumber.from(0)
  }

  try {
    parseEther = utils.parseEther(value)
  } catch (error) {
    console.log('error=', error)
    parseEther = BigNumber.from(0)
  }

  /**
   *
   * @param {*} v
   * @returns
   */
  const objRender = useCallback(v => {
    const type = typeof v
    const isBigNumber = v instanceof BigNumber
    if (isBigNumber) {
      return (
        <Space>
          <span>type: BigNumber</span>
          <span>value: {JSON.stringify(v)}</span>
          <span>toString: {v?.toString()}</span>
          {/* <span>toFixed: {v.toFixed()}</span> */}
        </Space>
      )
    } else if (type === 'string') {
      return (
        <Space>
          <span>type: {type}</span>
          <span>value: {v}</span>
          <span>toString: {v?.toString()}</span>
          {/* <span>toFixed: {v?.toFixed()}</span> */}
        </Space>
      )
    }
  })

  return (
    <Descriptions title="Demo1" column={1}>
      <Descriptions.Item label="Input">
        <Input size="small" style={{ width: 200 }} placeholder="Basic usage" value={value} onChange={event => setValue(event.target.value)} />
      </Descriptions.Item>
      <Descriptions.Item label="ethers.BigNumber(value)">
        <div>{objRender(bigNumberValue)}</div>
      </Descriptions.Item>
      <Descriptions.Item label="utils.parseUnits(value, 6)">
        <div>{objRender(parseUnits)}</div>
      </Descriptions.Item>
      <Descriptions.Item label="utils.parseEther(value)">
        <div>{objRender(parseEther)}</div>
      </Descriptions.Item>
      <Descriptions.Item label="utils.formatEther(parseEther)">
        <div>{objRender(utils.formatEther(parseEther))}</div>
      </Descriptions.Item>
      <Descriptions.Item label="parseEther.isZero()">
        <div>{objRender(parseEther.isZero())}</div>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default Demo1
