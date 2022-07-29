import React, { useState, useEffect, useContext, useCallback } from "react";

// === Components === //
import {
  Button,
  Collapse,
  Table,
  Space,
  Row,
  Col,
  Input,
  Modal,
  List,
} from "antd";
import {
  CloudDownloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Transaction } from "../components";

// === Reducer === //
import { Web3Context } from "../reducer/web3Reducer";
import {
  WEB3_INIT,
  UPDATE_BLOCK_NUMBER,
  LOAD_MORE,
  UPDATE_BLOCK_DETAIL,
  UPDATE_HASH_DETAIL,
} from "../reducer/actions";

// === Utils === //
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { decodeLogs } from "./../utils/decode-util";
import { find, get } from "lodash";

const { Panel } = Collapse;

const columns = [
  {
    title: "id",
    dataIndex: "transactionIndex",
    key: "transactionIndex",
    render: (v) => v + 1,
  },
  {
    title: "BlockHash",
    dataIndex: "blockHash",
    key: "blockHash",
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "Loaded",
    dataIndex: "decodeData",
    key: "decodeData",
    render: (v) => {
      return v === undefined ? (
        <CloudDownloadOutlined />
      ) : (
        <CheckCircleOutlined />
      );
    },
  },
];
function Scan() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rpc, setRpc] = useState("https://rpc-qa-sg.bankofchain.io");
  const { state, dispatch } = useContext(Web3Context);
  const {
    web3Instance,
    blockList = [],
    blockNumber,
    currentBlock,
    currentHash,
  } = state;
  const fetchNewestBlockNumber = useCallback(() => {
    setLoading(true);
    return web3Instance.eth
      .getBlockNumber()
      .catch(() => -1)
      .then((nextBlockNumber) => {
        dispatch({ type: UPDATE_BLOCK_NUMBER, payload: nextBlockNumber });
      })
      .finally(() =>
        setTimeout(() => {
          dispatch({ type: LOAD_MORE });
          setLoading(false);
        }, 1000)
      );
  }, [web3Instance, dispatch]);

  useEffect(() => {
    if (!isEmpty(web3Instance)) {
      fetchNewestBlockNumber();
    }
  }, [web3Instance, fetchNewestBlockNumber]);

  useEffect(() => {
    if (isEmpty(rpc)) return;
    dispatch({
      type: WEB3_INIT,
      payload: rpc,
    });
  }, [rpc, dispatch]);

  const loadMore = () => {
    dispatch({ type: LOAD_MORE });
  };

  const loadDetail = async (blockNumber = 0) => {
    if (blockNumber <= 0 || blockNumber === NaN) return;
    const details = await web3Instance.eth
      .getBlock(`${blockNumber}`)
      .then((blockDetail) => {
        const { transactions } = blockDetail;
        const transactionRequestArray = map(
          transactions,
          web3Instance.eth.getTransaction
        );
        return Promise.all(transactionRequestArray);
      });
    dispatch({
      type: UPDATE_BLOCK_DETAIL,
      payload: { id: blockNumber, isInit: true, details },
    });
  };

  const loadTransactionDetails = async (blockNumber, transactionHash) => {
    Promise.all([
      web3Instance.eth.getTransaction(transactionHash),
      web3Instance.eth.getTransactionReceipt(transactionHash),
    ])
      .then((resp) => {
        const [a, r, ...x] = resp;
        const nextData = decodeLogs(resp[1]);
        dispatch({
          type: UPDATE_HASH_DETAIL,
          payload: {
            id: blockNumber,
            hash: transactionHash,
            decodeData: nextData,
          },
        });
      })
      .then(() => setOpenModal(true));
  };
  console.log("state, dispatch=", state);

  const currentBlockItem = find(blockList, { id: currentBlock });
  const currentTransationItem = find(currentBlockItem?.details, {
    hash: currentHash,
  });
  console.log("currentTransationItem=", currentTransationItem);
  return (
    <Row gutter={[12, 12]} style={{ padding: 24 }}>
      <Col span={24}>
        <Input
          placeholder="rpc url"
          value={rpc}
          onChange={(v) => setRpc(v.target.value)}
        />
      </Col>
      <Col span={24}>
        <p>
          The Newest Block Number:
          <span style={{ fontWeight: "bold", margin: "0 0.5rem" }}>
            {state.blockNumber}
          </span>
          {loading ? (
            <LoadingOutlined />
          ) : (
            <SyncOutlined onClick={fetchNewestBlockNumber} />
          )}
        </p>
      </Col>
      <Col span={24}>
        <Collapse
          accordion
          activeKey={currentBlock}
          onChange={(v) => loadDetail(1 * v)}
        >
          {map(blockList, (blockItem) => {
            const { id, details, isInit } = blockItem;
            return (
              <Panel
                header={
                  <Space>
                    {id}
                    {isInit ? `(${details.length})` : <CloudDownloadOutlined />}
                  </Space>
                }
                key={id}
              >
                <Table
                  rowKey={(record) => record.transactionIndex}
                  size="small"
                  dataSource={details}
                  columns={[
                    ...columns,
                    {
                      title: "Remark",
                      dataIndex: "hash",
                      key: "hash",
                      render: (v) => {
                        return (
                          <Space>
                            <Button
                              type="link"
                              size="small"
                              onClick={() => loadTransactionDetails(id, v)}
                            >
                              Detail
                            </Button>
                          </Space>
                        );
                      },
                    },
                  ]}
                />
              </Panel>
            );
          })}
        </Collapse>
      </Col>
      {blockNumber > 0 && (
        <Col span={24}>
          <Button type="primary" style={{ width: "100%" }} onClick={loadMore}>
            Load More
          </Button>
        </Col>
      )}
      <Modal
        title="Transation Details"
        visible={openModal}
        width="100%"
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      >
        <p>Hash: {currentTransationItem?.hash}</p>
        {currentTransationItem === undefined ||
        currentTransationItem.decodeData === undefined ? (
          <p>解析失败</p>
        ) : (
          <List
            size="small"
            header={null}
            footer={null}
            bordered
            dataSource={currentTransationItem.decodeData}
            renderItem={(ii) => <Transaction data={ii} />}
          />
        )}
      </Modal>
    </Row>
  );
}

export default Scan;
