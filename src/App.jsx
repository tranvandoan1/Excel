import { DeleteOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import "./upfile.css";
import moment from "moment";
import {
  addDataMonth,
  getAllDataMonth,
  removemonthgori,
  uploadmonthgori,
} from "./features/dataMonthSlice";
import Loading from "./Loading";

const dataMonth = [
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
  { value: "6", label: "Tháng 6" },
  { value: "7", label: "Tháng 7" },
  { value: "8", label: "Tháng 8" },
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
];

const App = () => {
  const date = moment().date();
  const month = moment().month() + 1;
  const year = moment().year();

  const milliseconds = moment().milliseconds();
  const minutes = moment().minutes();
  const hours = moment().hours();

  const dispatch = useDispatch();
  const [selectData, setSelectData] = useState();

  const [comfimUploadStauts, setComfimUploadStauts] = useState({
    status: false,
    data: undefined,
  });
  const datas = useSelector((data) => data.dataMonth.value);
  const [update, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState("");
  const [valueSave, setValueSave] = useState();
  const [valueUploadPriveCode, setValueUploadPriveCode] = useState();
  const [value, setValue] = useState();
  const [selectMonth, setSelectMonth] = useState(month);
  const [uploadData, setUploadData] = useState({
    status: false,
    data: undefined,
  });
  const [comfimDelete, setComfimDelete] = useState({
    status: false,
    data: undefined,
  });
  const [uploadPriveCode, setUploadPriveCode] = useState({
    status: false,
    data: undefined,
  });
  const [valueNodeCheck, setValueNodeCheck] = useState();
  const [nodeCheck, setNodeCheck] = useState({
    status: false,
    data: undefined,
  });
  const [comfimSave, setComfimSave] = useState(false);
  let sum = 0;
  for (let i = 0; i < dataNew?.length; i++) {
    sum += +Math.ceil(dataNew[i].needs_pay * ((100 - 0) / 100));
  }
  useEffect(() => {
    dispatch(getAllDataMonth());
  }, []);

  useEffect(() => {
    if (datas?.data?.length > 0) {
      const dataMonthSelect = datas?.data?.find(
        (item) => item.month.slice(6, 8) == selectMonth
      );
      setSelectData(dataMonthSelect);
      setDataNew(
        dataMonthSelect == undefined ? [] : JSON.parse(dataMonthSelect?.data)
      );
    }
  }, [datas, selectMonth, nodeCheck]);
  const refInput = useRef();

  // nhập execel
  const importData = (e) => {
    setUpload(true);
    const file = e.target.files[0];

    setNameFile(file.name);
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let headers = fileData[0].map((res) => res.trim());
      fileData.splice(0, 1);
      if (headers.length === 0) {
        headers = fileData[0].map((res) => res.trim());
      }
      const rows = [];
      fileData.forEach((item) => {
        let rowData = {};
        item.forEach((element, index, key) => {
          rowData[headers[index]] = element;
        });
        rows.push(rowData);
      });
      let datas = [];
      rows.map((item) => {
        const newObject = {};
        newObject["name"] = item["Tên khách hàng"];
        newObject["notes"] = item["Ghi chú"];
        newObject["commodity_notes"] = item["Ghi chú hàng hóa"];
        // newObject["price"] = item["Giá bán"];
        newObject["needs_pay"] = item["Khách cần trả"];
        newObject["has_paid"] = item["Khách đã trả"];
        newObject["code"] = item["Mã hóa đơn"];
        newObject["seller"] = item["Người bán"];
        newObject["creator"] = item["Người tạo"];
        newObject["time"] = item["Thời gian"];
        newObject["cash"] = item["Tiền mặt"];
        newObject["name_pro"] = item["Tên hàng"];
        newObject["address"] = item["Địa chỉ (Khách hàng)"];
        newObject["phone"] = item["Điện thoại"];
        return datas.push(newObject);
      });
      const newData = [];
      datas?.map((item) =>
        newData.push({ key: Math.random(), ...item, status: 0 })
      );
      setDataNew(newData);
    };
    reader.readAsBinaryString(file);
  };

  // lưu
  const submitSave = async () => {
    const dataFind = datas?.data?.find((item) => item._id == uploadData?.data);
    if (uploadData?.status == true) {
      const newData = [...dataNew, ...JSON.parse(dataFind.data)];
      setLoading(true);
      await dispatch(uploadmonthgori({ _id: uploadData?.data, data: newData }));
      setLoading(false);
      setUpload(false);
      setUploadData(false);
      setUploadData({ status: false, data: undefined });
    } else {
      await dispatch(addDataMonth({ data: dataNew, name: valueSave }));
      setValueSave();
      setUpload(false);
    }

    setLoading(false);
    setComfimSave(false);
    setNameFile();
    message.success('Lưu thành công')

    refInput.current.value = "";
  };

  // lưu thay đổi tiền cọc
  const submitSaveValueUploadPriveCode = async () => {
    setLoading(true);
    for (let i = 0; i < dataNew?.length; i++) {
      if (uploadPriveCode.data.key == dataNew[i].key) {
        dataNew[i].has_paid = valueUploadPriveCode;
      }
    }
    await dispatch(uploadmonthgori({ _id: selectData?._id, data: dataNew }));
    setLoading(false);
    setUploadPriveCode({ status: false, data: undefined });
    setValueUploadPriveCode();
    message.success('Cập nhật tiền cọc thành công')

  };

  const submitCole = () => {
    setDataNew([]);
    setUpload(false);
    setNameFile();
    refInput.current.value = "";
  };

  // chọn trạng thái muốn cập nhật
  const uploadStatus = async () => {
    setLoading(true);
    for (let i = 0; i < dataNew?.length; i++) {
      if (comfimUploadStauts.data.key == dataNew[i].key) {
        dataNew[i].status = value;
      }
    }
    await dispatch(uploadmonthgori({ _id: selectData?._id, data: dataNew }));
    setLoading(false);
    setComfimUploadStauts({ status: false, data: undefined });
    setValueSave;
    message.success('Cập nhật trạng thái thành công')

  };
  const handleCancel = () => {
    setComfimUploadStauts({ status: false, data: undefined });
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "address",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      render: (name) => <a>{name}</a>,
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "age",
      render: (notes) => (
        <div>
          <span style={{ color: notes == "khách cũ" ? "#FF9900" : "blue", fontWeight: '600' }}>
            {notes}
          </span>
        </div>
      ),
    },
    {
      title: "Ghi chú hàng hóa",
      dataIndex: "commodity_notes",
      key: "commodity_notes",
      width: 100,
    },
    {
      title: "Khách cần trả",
      dataIndex: "needs_pay",
      key: "needs_pay",
      render: (needs_pay, data) => (
        <a style={{ color: "red", fontWeight: "600" }}>
          {needs_pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </a>
      ),
    },
    {
      title: "Khách đã trả",
      dataIndex: "has_paid",
      key: "has_paid",
      render: (has_paid, data) => (
        <a
          style={{ color: "red", fontWeight: "600", cursor: "pointer" }}
          onClick={() => setUploadPriveCode({ status: true, data: data })}
        >
          {has_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </a>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Địa chỉ (Khách hàng)",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ghi chú check",
      dataIndex: "nodeCheck",
      key: "nodeCheck",
      width: 200,
      render: (nodeCheck, data) => (
        <span
          style={{ color: "red", fontWeight: "600", cursor: "pointer" }}
          onClick={() => setNodeCheck({ status: true, data: data })}
        >
          <EyeOutlined />
          {nodeCheck?.length > 0 ? <span>Check</span> : ""}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (status, data) => (
        <div
          className="status"
          onClick={() => {
            setComfimUploadStauts({ status: true, data: data });
            setValue(status);
          }}
        >
          {status == 0 ? (
            <span className="dvc">Đang vân chuyển</span>
          ) : status == 1 ? (
            <span className="cdh">Chờ duyệt hàng</span>
          ) : status == 2 ? (
            <span className="dg">Đang giao</span>
          ) : status == 3 ? (
            <span className="hoan">Hoàn</span>
          ) : status == 5 ? (
            <span className="hoan">Bỏ</span>
          ) : (
            <span className="susse">Thành công</span>
          )}
        </div>
      ),
    },
  ];
  const handleChange = (value) => {
    setSelectMonth(value);
  };
  const handleChange1 = (value) => {
    setUploadData({ status: uploadData.status, data: value });
  };
  // xóa danh sách
  const deleteMonth = async () => {
    setLoading(true);
    await dispatch(removemonthgori({ _id: comfimDelete?.data }));
    setLoading(false);
    setComfimDelete({ status: false, data: undefined });
    message.success('Xóa thành công')
  };
  const handleCancel1 = () => {
    setComfimDelete({ status: false, data: undefined });
  };

  const bo = [];
  const hoan = [];
  const tc = [];
  dataNew?.map((item) => {
    if (item.status == 5) {
      bo?.push(item);
    } else if (item.status == 4) {
      tc?.push(item);
    } else if (item.status == 3) {
      hoan?.push(item);
    }
  });
  let sumTc = 0;
  for (let i = 0; i < tc?.length; i++) {
    sumTc += +Math.ceil(tc[i].needs_pay * ((100 - 0) / 100));
  }
  let sumBo = 0;
  for (let i = 0; i < bo?.length; i++) {
    sumBo += bo[i].needs_pay;
  }
  const onChange1 = (checked) => {
    setUploadData({ status: checked, data: uploadData?.data });
  };
  const submitSaveNodeCheck = async () => {
    setLoading(true);
    const newDataNode = {
      _id: Math.random(),
      value: valueNodeCheck,
      time: `${year}-${month}-${date} ${hours}-${minutes}`,
    };
    for (let i = 0; i < dataNew.length; i++) {
      if (dataNew[i].key == nodeCheck.data.key) {
        dataNew[i].nodeCheck =
          dataNew[i].nodeCheck?.length > 0
            ? [...dataNew[i].nodeCheck, newDataNode]
            : [newDataNode];
      }
    }
    await dispatch(uploadmonthgori({ _id: selectData?._id, data: dataNew }));
    setNodeCheck({ status: false, data: undefined });
    setValueNodeCheck();
    setLoading(false);
    message.success('Cập nhật thành công')

  };

  return (
    <div className="header">
      {loading == true && <Loading />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div>
          <h1>Danh sách khách hàng</h1>
          <div>Hoàn : {hoan?.length}</div>
          <div>Bỏ : {bo?.length}</div>
          <div>Thành công : {tc?.length}</div>
          <div>
            Tổng tiền thành công :{" "}
            {sumTc?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h5 style={{ color: "red", fontSize: 20, marginRight: 30 }}>
            Tổng tiền :{" "}
            {(sum - sumBo)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ
          </h5>
          <div>
            <Select
              defaultValue={month}
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={dataMonth}
            />
          </div>
        </div>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <Button style={{ cursor: "pointer" }}>
            <label htmlFor="up-file">
              {update == false && (
                <div className="buttonUpfile">
                  <UploadOutlined className="icon" /> Tải file excel
                </div>
              )}

              {nameFile && dataNew.length > 0 && (
                <span className="spanUploadName">{nameFile}</span>
              )}
            </label>
          </Button>
          <Input
            type="file"
            ref={refInput}
            onChange={(e) => {
              refInput.current.value = "";
              importData(e);
            }}
            id="up-file"
          />
        </div>
        {update && (
          <div>
            <Button onClick={() => setComfimSave(true)} type="primary">
              Lưu
            </Button>
            <Button onClick={() => submitCole()} style={{ marginLeft: 10 }}>
              Huỷ
            </Button>
          </div>
        )}
        <Button
          onClick={() =>
            setComfimDelete({ status: true, data: selectData?._id })
          }
          style={{ marginLeft: 10 }}
        >
          Xóa
        </Button>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={dataNew}
          style={{ width: "100%" }}
          expandable={{
            expandedRowRender: (record) => (
              <React.Fragment>
                <div>
                  <span>Người bán</span> :
                  <span
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.seller}
                  </span>
                </div>
                <div>
                  <span>Người tạo</span> :
                  <span
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.creator}
                  </span>
                </div>

                <div>
                  <span>Tên hàng</span> :
                  <span
                    style={{
                      margin: 0,
                    }}
                  >
                    {record.name_pro}
                  </span>
                </div>
              </React.Fragment>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
      {/* {dataNew?.length > 0 ? (
        <div>
          <Table
            columns={columns}
            dataSource={dataNew}
            style={{ width: "100%" }}
            expandable={{
              expandedRowRender: (record) => (
                <React.Fragment>
                  <div>
                    <span>Người bán</span> :
                    <span
                      style={{
                        margin: 0,
                      }}
                    >
                      {record.seller}
                    </span>
                  </div>
                  <div>
                    <span>Người tạo</span> :
                    <span
                      style={{
                        margin: 0,
                      }}
                    >
                      {record.creator}
                    </span>
                  </div>

                  <div>
                    <span>Tên hàng</span> :
                    <span
                      style={{
                        margin: 0,
                      }}
                    >
                      {record.name_pro}
                    </span>
                  </div>
                </React.Fragment>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
          />
        </div>
      ) : (
        datas?.data?.map((item) => {
          return (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5 style={{ textTransform: "capitalize" }}>{item.month}</h5>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setComfimDelete({ status: true, data: item })}
                >
                  <DeleteOutlined />
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={JSON.parse(item?.data)}
                style={{ width: "100%" }}
                expandable={{
                  expandedRowRender: (record) => (
                    <React.Fragment>
                      <div>
                        <span>Người bán</span> :
                        <span
                          style={{
                            margin: 0,
                          }}
                        >
                          {record.seller}
                        </span>
                      </div>
                      <div>
                        <span>Người tạo</span> :
                        <span
                          style={{
                            margin: 0,
                          }}
                        >
                          {record.creator}
                        </span>
                      </div>

                      <div>
                        <span>Tên hàng</span> :
                        <span
                          style={{
                            margin: 0,
                          }}
                        >
                          {record.name_pro}
                        </span>
                      </div>
                    </React.Fragment>
                  ),
                  rowExpandable: (record) => record.name !== "Not Expandable",
                }}
              />
            </div>
          );
        })
      )} */}

      <Modal
        title={<span style={{ fontSize: 20 }}>Cập nhật trạng thái</span>}
        open={comfimUploadStauts.status}
        onOk={uploadStatus}
        onCancel={handleCancel}
        cancelText="Đóng"
        okText="Thay đổi"
      >
        <hr />
        <h5>Tên khách hàng : {comfimUploadStauts?.data?.name}</h5>
        <Radio.Group onChange={onChange} value={value} style={{ fontSize: 30 }}>
          <Radio style={{ fontSize: 18 }} value={0}>
            Đang vân chuyển
          </Radio>
          <br />
          <Radio style={{ fontSize: 18 }} value={1}>
            Chờ duyệt hàng
          </Radio>
          <br />
          <Radio style={{ fontSize: 18 }} value={2}>
            Đang giao
          </Radio>
          <br />
          <Radio style={{ fontSize: 18 }} value={3}>
            Hoàn
          </Radio>
          <br />
          <Radio style={{ fontSize: 18 }} value={4}>
            Thành công
          </Radio>
          <Radio style={{ fontSize: 18 }} value={5}>
            Bỏ
          </Radio>
        </Radio.Group>
      </Modal>
      <Modal
        title="Xóa danh sách"
        open={comfimDelete?.status}
        onOk={deleteMonth}
        onCancel={handleCancel1}
      >
        <div>{comfimDelete?.data?.month}</div>
      </Modal>
      <Modal
        title="Nhập tên danh sách muốn lưu !"
        open={comfimSave}
        onOk={() => submitSave()}
        onCancel={() => setComfimSave(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên danh sách muốn lưu"
          onChange={(e) => setValueSave(e.target.value)}
        />
        <Select
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={handleChange1}
        >
          {datas?.data?.map((item) => {
            return (
              <Select.Option
                value={item._id}
                style={{ textTransform: "capitalize" }}
              >
                {item.month}
              </Select.Option>
            );
          })}
        </Select>
        <Switch defaultChecked={uploadData?.status} onChange={onChange1} />
      </Modal>
      <Modal
        title="Nhập số tiền cọc !"
        open={uploadPriveCode?.status}
        onOk={() => submitSaveValueUploadPriveCode()}
        onCancel={() => setUploadPriveCode({ status: false, data: undefined })}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập số tiền cọc"
          defaultValue={uploadPriveCode?.data?.has_paid
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={(e) => setValueUploadPriveCode(e.target.value)}
        />
      </Modal>
      <Modal
        title="Nhập ghi chú !"
        open={nodeCheck?.status}
        onOk={() => submitSaveNodeCheck()}
        onCancel={() => setNodeCheck({ status: false, data: undefined })}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập ghi chú"
          key={nodeCheck?.status}
          defaultValue={valueNodeCheck}
          onChange={(e) => setValueNodeCheck(e.target.value)}
        />
        <div style={{ overflow: "auto", height: 400 }}>
          {nodeCheck?.data?.nodeCheck == undefined ? (
            <div></div>
          ) : (
            nodeCheck?.data?.nodeCheck?.map((item) => {
              return (
                <div>
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 14,
                          fontStyle: "italic",
                          fontWeight: "500",
                        }}
                      >
                        {item.time}
                      </span>
                      <div style={{ color: 'blue' }}>{item.value}</div>
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => console.log(item, "3ewfd")}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
};

export default App;
