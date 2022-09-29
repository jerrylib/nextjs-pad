import React, { useCallback, useEffect, useState } from 'react'

// === Components === //
import { Row, Col, Descriptions, DatePicker, Spin } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { useRouter } from 'next/router'

// === Services ==== //
import { getStrategyApysOffChain, getBaseApyByPage, getStrategyApyDetails } from './api/boc-apy'

// === Utils === //
import get from 'lodash/get'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'
import reduce from 'lodash/reduce'
import last from 'lodash/last'
import filter from 'lodash/filter'
import isNil from 'lodash/isNil'
import moment from 'moment'
import { formatToUTC0 } from './../utils/date-utils'
import { toFixed } from './../utils/number-format'

const { RangePicker } = DatePicker

const OFFICIAL_APY = 'Official Weekly APY'
const VERIFIED_APY = 'Verified Weekly APY'
const OFFICIAL_DAILY_APY = 'Official Daily APY'
const VERIFIED_DAILY_APY = 'Verified Daily APY'
const DAILY_WEIGHT_ASSETS = 'Daily Weight Assets'

const EchartV2 = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [days, setDays] = useState(32)
  const [strategyName, setStrategyName] = useState('UniswapV3RethEth3000Strategy')
  const [chainId, setChainId] = useState('1')
  const [vaultAddress, setVaultAddress] = useState('0x8f0Cb368C63fbEDF7a90E43fE50F7eb8B9411746')
  const [strategyAddress, setStrategyAddress] = useState('0x3c1a3bf0a77460985a797011f46cbf2521e1793f')

  const [datas, setDatas] = useState([])

  const current = moment().utcOffset(0).startOf('day')
  const [range, setRange] = useState([current.clone().subtract(days, 'day'), current])

  const [startDate = current.clone().subtract(20, 'day'), endDate = current] = range || []

  const isOri = get(router, 'query.ori', false)

  const lends = isOri ? [OFFICIAL_APY, VERIFIED_APY, OFFICIAL_DAILY_APY, VERIFIED_DAILY_APY] : [OFFICIAL_APY, VERIFIED_APY]

  const dataFetch = useCallback(() => {
    setIsLoading(true)
    const limit = current.diff(startDate, 'days')
    Promise.all([
      getBaseApyByPage(
        {
          chainId,
          vaultAddress,
          strategyName,
          sort: 'schedule_timestamp desc'
        },
        0,
        limit
      ).catch(() => {}),
      getStrategyApysOffChain(
        {
          chainId,
          strategyName,
          sort: 'fetch_time desc'
        },
        0,
        limit
      ).catch(() => {}),
      getStrategyApyDetails(chainId, vaultAddress, strategyAddress, 0, limit)
    ])
      .then(([apys = { content: [] }, offChainApys, dailyApy]) => {
        console.log('apys=', apys, offChainApys, dailyApy)
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

        const offChainApyMap = keyBy(
          map(offChainApys.content, i => {
            return {
              value: 100 * i.apy,
              officialApy: (i.apy * 100).toFixed(2),
              originApy: (i.originApy * 100).toFixed(2),
              offcialDetail: i.detail,
              date: formatToUTC0(i.fetchTime * 1000, 'yyyy-MM-DD')
            }
          }),
          'date'
        )
        const extentApyMap = keyBy(
          map(apys.content, i => {
            return {
              realizedApy: (i.realizedApy?.value * 100).toFixed(2),
              realizedApyDetail: i.realizedApy?.detail,
              unrealizedApy: (i.unrealizedApy?.value * 100).toFixed(2),
              unrealizedApyDetail: i.unrealizedApy?.detail,
              expectedApy: (i.verifiedApy * 100).toFixed(2),
              dailyVerifiedApy: (i.dailyVerifiedApy * 100).toFixed(2),
              date: formatToUTC0(i.scheduleTimestamp * 1000, 'yyyy-MM-DD')
            }
          }),
          'date'
        )

        const dailyApyMap = keyBy(
          map(dailyApy, i => {
            return {
              dailyWeightAsset: toFixed(i.dailyWeightAsset, 1e18),
              date: formatToUTC0(i.scheduleTimestamp * 1000, 'yyyy-MM-DD')
            }
          }),
          'date'
        )

        const lastDailyItem = last(filter(dailyApy, i => !isNil(i.apyValidateTime)))
        let preDayOfficialApy = null
        let hasMatch = false

        const nextApyArray = map(calcArray, i => {
          const { officialApy, originApy, offcialDetail } = get(offChainApyMap, i, {
            officialApy: null,
            originApy: null,
            offcialDetail: []
          })
          const { expectedApy, realizedApy, unrealizedApy, dailyVerifiedApy, realizedApyDetail, unrealizedApyDetail } = get(extentApyMap, i, {
            expectedApy: null,
            unrealizedApy: null,
            realizedApy: null,
            dailyVerifiedApy: null,
            realizedApyDetail: [],
            unrealizedApyDetail: []
          })
          const { dailyWeightAsset } = get(dailyApyMap, i, {
            dailyWeightAsset: null
          })
          const nextItem = {
            date: i,
            originApy,
            value: expectedApy,
            officialApy: hasMatch ? null : isNil(officialApy) ? preDayOfficialApy : officialApy,
            realizedApy,
            unrealizedApy,
            offcialDetail,
            realizedApyDetail,
            unrealizedApyDetail,
            dailyVerifiedApy,
            dailyWeightAsset
          }
          hasMatch = hasMatch || i === lastDailyItem?.apyValidateTime
          preDayOfficialApy = nextItem.officialApy
          return nextItem
        })
        setDatas(nextApyArray)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [startDate.valueOf(), endDate.valueOf()])

  const customChart = {
    title: {
      text: 'Apy 曲线'
    },
    animation: false,
    legend: {
      show: !0,
      x: 'right',
      y: 'top',
      data: lends
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
        data: map(datas, 'date')
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
    series: map(lends, (i, index) => {
      const key = index + 1
      return {
        key,
        name: i,
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
        data: map(datas, ii => {
          if (i === OFFICIAL_APY) {
            return ii.officialApy
          } else if (i === VERIFIED_APY) {
            return ii.value
          } else if (i === OFFICIAL_DAILY_APY) {
            return ii.originApy
          } else if (i === VERIFIED_DAILY_APY) {
            return ii.dailyVerifiedApy
          }
          return
        }),
        symbol: 'none',
        legendHoverLink: !1,
        z: key
      }
    })
  }

  const assetChart = {
    title: {
      text: '持仓情况'
    },
    animation: false,
    legend: {
      show: !0,
      x: 'right',
      y: 'top',
      data: [DAILY_WEIGHT_ASSETS]
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
        data: map(datas, 'date')
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
    series: [
      {
        key: 1,
        name: DAILY_WEIGHT_ASSETS,
        type: 'line',
        smooth: !0,
        itemStyle: {
          normal: {
            areaStyle: {
              // color: colors[index],
              type: 'default'
            }
          }
        },
        data: map(datas, 'dailyWeightAsset'),
        symbol: 'none',
        legendHoverLink: !1,
        z: 1
      }
    ]
  }

  console.log('data=', datas, customChart)

  useEffect(() => {
    dataFetch()
  }, [dataFetch])

  return (
    <Row style={{ padding: 20 }}>
      <Spin spinning={isLoading}>
        <Col span={24}>
          <Descriptions title="Filter" column={1}>
            <Descriptions.Item label="Range">
              <RangePicker value={range} onChange={setRange} />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          <ReactEcharts key={customChart.series.length} option={customChart} style={{ height: '500px', width: '100%' }} />
        </Col>
        <Col span={24} style={{ marginTop: '2rem' }}>
          <ReactEcharts key={assetChart.series.length} option={assetChart} style={{ height: '500px', width: '100%' }} />
        </Col>
      </Spin>
    </Row>
  )
}

export default EchartV2
