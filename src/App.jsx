import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Radio, Select, Table, message } from "antd";
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
  const datee = moment().date();
  const month = moment().month() + 1;
  const year = moment().year();

  const dispatch = useDispatch();
  const [selectData, setSelectData] = useState();

  const [comfimUploadStauts, setComfimUploadStauts] = useState({
    status: false,
    data: undefined,
  });
  const datas = useSelector((data) => data.dataMonth.value);
  const [loading, setLoading] = useState(false);
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState("");
  const [valueSave, setValueSave] = useState();
  const [value, setValue] = useState();
  const [selectMonth, setSelectMonth] = useState(month);
  const [comfimDelete, setComfimDelete] = useState({
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
  }, [datas, selectMonth]);

  const refInput = useRef();

  const importData = (e) => {
    console.log(e, "1weds");
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
    await dispatch(addDataMonth({ data: dataNew, name: valueSave }));
    setDataNew([]);
    setNameFile();
    setComfimSave(false);
    setValueSave();

    refInput.current.value = "";
  };

  const submitCole = () => {
    setDataNew([]);
    setNameFile();
    refInput.current.value = "";
  };

  // chọn trạng thái muốn cập nhật
  const handleOk = async () => {
    setLoading(true);
    for (let i = 0; i < dataNew?.length; i++) {
      if (comfimUploadStauts.data.key == dataNew[i].key) {
        dataNew[i].status = value;
      }
    }
    await dispatch(uploadmonthgori({ _id: selectData?._id, data: dataNew }));
    setLoading(false);
    setComfimUploadStauts({ status: false, data: undefined });
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
      render: (text) => <a>{text}</a>,
      width: 200,
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "age",
    },
    {
      title: "Ghi chú hàng hóa",
      dataIndex: "commodity_notes",
      key: "address",
      width: 100,
    },
    {
      title: "Khách cần trả",
      dataIndex: "needs_pay",
      key: "address",
      render: (needs_pay) => (
        <a style={{ color: "red", fontWeight: "600" }}>
          {needs_pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </a>
      ),
    },
    {
      title: "Khách đã trả",
      dataIndex: "has_paid",
      key: "address",
      render: (has_paid) => (
        <a style={{ color: "red", fontWeight: "600" }}>
          {has_paid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </a>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "address",
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
      key: "address",
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
  // xóa danh sách
  const deleteMonth = async () => {
    setLoading(true);
    await dispatch(removemonthgori({ _id: comfimDelete?.data?._id }));
    setLoading(false);
    setComfimDelete({ status: false, data: undefined });
  };
  const handleCancel1 = () => {
    setComfimDelete({ status: false, data: undefined });
  };

  return (
    <div className="header">
      {loading == true && <Loading />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Danh sách khách hàng</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h5 style={{ color: "red", fontSize: 20, marginRight: 30 }}>
            Tổng tiền : {sum?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button style={{ cursor: "pointer" }}>
            <label htmlFor="up-file">
              {!nameFile && dataNew.length === 0 && (
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
              console.log(e, "2e32edwfdvf32efwvfd");
              refInput.current.value = "";
              importData(e);
            }}
            id="up-file"
          />
        </div>
        {dataNew.length > 0 && (
          <div>
            <Button onClick={() => setComfimSave(true)} type="primary">
              Lưu
            </Button>
            <Button onClick={() => submitCole()} style={{ marginLeft: 10 }}>
              Huỷ
            </Button>
          </div>
        )}
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
        onOk={handleOk}
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
      </Modal>
    </div>
  );
};

export default App;
