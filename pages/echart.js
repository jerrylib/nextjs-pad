import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import { Row, Col, Descriptions, Checkbox, DatePicker } from 'antd'
import ReactEcharts from 'echarts-for-react'

// === Utils === //
import get from 'lodash/get'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import axios from 'axios'

const { RangePicker } = DatePicker

const splitSymbol = '::'
const columeMap = {
  'FEES APY': 'apy',
  'NET APY': 'lossApy'
}
const KEY = 'SELECT_STRATEGY'

const Echart = () => {
  const [days, setDays] = useState(30)
  const [datas, setDatas] = useState([])
  const [range, setRange] = useState([new moment(new Date(2021, 4, 4)), new moment(new Date(2022, 8, 15))])
  const [strategies, setStrategies] = useState([
    'ETH_USDT_3000::NET APY',
    'ETH_USDT_500::NET APY',
    'ETH_USDC_500::NET APY',
    'ALLOCATION::NET APY',
    'ETH_DAI_3000::NET APY',
    'ETH_USDC_3000::NET APY',
    'ETH_DAI_500::NET APY'
  ])
  const [myChart, setMyChart] = useState()

  console.log('strategies=', strategies)
  const [startDate = moment().utcOffset(0).subtract(days, 'day').startOf('day'), endDate = moment().startOf('day')] = range || []

  const dataFetch = useCallback(() => {
    const url = `https://service-qa02-sg.bankofchain.io/uniswapv3_test_data?start=${startDate.valueOf()}&end=${endDate.valueOf()}`
    axios.get(url).then(resp => {
      setDatas(resp.data)
    })
  }, [startDate.valueOf(), endDate.valueOf()])

  const startMoment = startDate.clone()
  const calcArray = reduce(
    new Array(endDate.diff(startDate, 'days')),
    rs => {
      const currentMoment = startMoment.subtract(-1, 'day')
      rs.push(currentMoment.format('yyyy-MM-DD'))
      return rs
    },
    []
  )

  const dataGroups = groupBy(datas, 'strategyName')

  const strategyNames = Object.keys(dataGroups)

  const lineArray = map(strategies, i => {
    const [strategyName, colume] = i.split(splitSymbol)
    const offChainApyMap = keyBy(
      map(dataGroups[strategyName], i => {
        return {
          value: 1 * i[columeMap[colume]],
          date: moment(i.dateTimestamp * 1000)
            .utcOffset(0)
            .format('yyyy-MM-DD')
        }
      }),
      'date'
    )
    const nextApyArray = map(calcArray, i => {
      const { value } = get(offChainApyMap, i, {
        value: undefined
      })

      const nextItem = {
        date: i,
        value
      }
      return nextItem
    })
    return nextApyArray
  })

  const customChart = {
    animation: false,
    legend: {
      show: !0,
      x: 'right',
      y: 'top',
      data: strategies
    },
    grid: {
      x: 40,
      y: 60,
      x2: 40,
      y2: 30,
      borderWidth: 0
    },
    tooltip: {
      show: !0,
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#edf0f1'
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: !1
        },
        axisTick: {
          show: !1
        },
        axisLabel: {
          textStyle: {
            color: '#607685'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f3f3f3'
          }
        },
        data: calcArray
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: !1
        },
        axisTick: {
          show: !1
        },
        axisLabel: {
          textStyle: {
            color: '#607685'
          }
        },
        splitLine: {
          show: !0,
          lineStyle: {
            color: '#dddede'
          }
        }
      }
    ],
    series: map(lineArray, (ii, index) => {
      const key = index + 2
      return {
        key,
        name: strategies[index],
        type: 'line',
        smooth: !0,
        itemStyle: {
          normal: {
            // areaStyle: {
            //   // color: colors[index],
            //   type: 'default'
            // }
          }
        },
        data: map(ii, 'value'),
        symbol: 'none',
        legendHoverLink: !1,
        z: key
      }
    })
  }

  useEffect(() => {
    dataFetch()
  }, [dataFetch])

  return (
    <Row style={{ padding: 20 }}>
      <Col span={24}>
        <Descriptions title="Filter" column={1}>
          <Descriptions.Item label="Range">
            <RangePicker value={range} onChange={setRange} />
          </Descriptions.Item>
          <Descriptions.Item label="Strategies">
            <Checkbox.Group style={{ width: '100%' }} value={strategies} onChange={setStrategies}>
              <Row>
                {map(strategyNames, i => {
                  const title = `${i}${splitSymbol}`
                  return (
                    <Col span={6} key={i}>
                      <Checkbox value={`${title}NET APY`}>{`${title}NET APY`}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
              <br />
              <Row>
                {map(strategyNames, i => {
                  const title = `${i}${splitSymbol}`
                  return (
                    <Col span={6} key={i}>
                      <Checkbox value={`${title}FEES APY`}>{`${title}FEES APY`}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </Descriptions.Item>
          {/* <Descriptions.Item label="Days">
            <Radio.Group onChange={v => setDays(v.target.value)} value={days}>
              <Radio.Button value={7}>1 W</Radio.Button>
              <Radio.Button value={30}>1 M</Radio.Button>
              <Radio.Button value={365}>1 Y</Radio.Button>
              <Radio.Button value={1095}>3 Ys</Radio.Button>
            </Radio.Group>
          </Descriptions.Item> */}
        </Descriptions>
      </Col>
      <Col span={24}>
        <ReactEcharts key={customChart.series.length} option={customChart} style={{ height: '500px', width: '100%' }} />
      </Col>
    </Row>
  )
}

export default Echart
