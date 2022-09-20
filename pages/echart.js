import React, { useCallback, useEffect, useRef, useState } from 'react'

// === Components === //
import { Row, Col, Descriptions, Checkbox, DatePicker, Radio } from 'antd'

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

const colors = ['#00bcd3', '#8cc34b']
const splitSymbol = '::'

const Echart = () => {
  const [days, setDays] = useState(30)
  const [datas, setDatas] = useState([])
  const [range, setRange] = useState()
  const [strategies, setStrategies] = useState([])
  const [myChart, setMyChart] = useState()

  const [startDate = moment().utcOffset(0).subtract(days, 'day').startOf('day'), endDate = moment().startOf('day')] = range || []

  const dataFetch = useCallback(() => {
    const url = `https://service-qa02-sg.bankofchain.io/uniswapv3_test_data?start=${startDate.valueOf()}&end=${endDate.valueOf()}`
    axios.get(url).then(resp => {
      setDatas(resp.data)
    })
  }, [startDate.valueOf(), endDate.valueOf()])

  useEffect(() => {
    if (isEmpty(myChart)) return
    dataFetch()
  }, [myChart, dataFetch])

  useEffect(() => {
    var myChart = echarts.init(document.getElementById('chart'))
    setMyChart(myChart)
  }, [])

  const startMoment = startDate.clone()
  const calcArray = reduce(
    new Array(days),
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
          value: 1 * i[colume],
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
      return {
        name: strategies[index],
        type: 'line',
        smooth: !0,
        itemStyle: {
          normal: {
            color: colors[index],
            areaStyle: {
              color: colors[index],
              type: 'default'
            }
          }
        },
        data: map(ii, 'value'),
        symbol: 'none',
        legendHoverLink: !1,
        z: index + 2
      }
    })
  }

  myChart?.setOption(customChart)

  return (
    <Row>
      <Col span={24}>
        <Descriptions title="Filter" column={1}>
          <Descriptions.Item label="Strategies">
            <Checkbox.Group style={{ width: '100%' }} value={strategies} onChange={setStrategies}>
              <Row>
                {map(strategyNames, i => {
                  const apyTitle = `${i}${splitSymbol}apy`
                  const lossApyTitle = `${i}${splitSymbol}lossApy`
                  return (
                    <>
                      <Col span={6} key={apyTitle}>
                        <Checkbox value={apyTitle}>{apyTitle}</Checkbox>
                      </Col>
                      <Col span={6} key={lossApyTitle}>
                        <Checkbox value={lossApyTitle}>{lossApyTitle}</Checkbox>
                      </Col>
                    </>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </Descriptions.Item>
          <Descriptions.Item label="Range">
            <RangePicker onChange={setRange} />
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
        <div id="chart" style={{ height: '500px', width: '100%' }}></div>
      </Col>
    </Row>
  )
}

export default Echart
