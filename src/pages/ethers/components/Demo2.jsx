import React, { useCallback, useState } from 'react'

// === Components === //
import { Input, Row, Col, Space, Descriptions } from 'antd'

// === Utils === //
import * as ethers from 'ethers'

const { FixedNumber, utils } = ethers
const Demo2 = () => {
  const [value, setValue] = useState('')

  console.log('utils=', utils, ethers)
  let bigNumberValue, parseUnits, parseEther
  try {
    bigNumberValue = FixedNumber.from(value)
  } catch (error) {
    bigNumberValue = FixedNumber.from(0)
  }

  try {
    parseUnits = utils.parseUnits(value, 6)
  } catch (error) {
    parseUnits = FixedNumber.from(0)
  }

  try {
    parseEther = utils.parseEther(value)
  } catch (error) {
    console.log('error=', error)
    parseEther = FixedNumber.from(0)
  }
  /**
   *
   * @param {*} v
   * @returns
   */
  const objRender = useCallback(v => {
    const type = typeof v
    const isFixedNumber = v instanceof FixedNumber
    if (isFixedNumber) {
      return (
        <Space>
          <span>type: FixedNumber</span>
          <span>value: {JSON.stringify(v, undefined, 2)}</span>
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
    <Descriptions title="Demo2" column={1}>
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
    </Descriptions>
  )
}

export default Demo2
