import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Radio, Table, message } from "antd";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import "./upfile.css";
const App = () => {
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState("");

  const importData = (e) => {
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
        newData.push({ key: Math.random(), ...item, status: 1 })
      );
      setDataNew(newData);
    };
    reader.readAsBinaryString(file);
  };
  const submitSave = () => {
    const dataUpload = {
      data: dataNew,
      smester_id,
      campus_id,
    };
  };
  const notifications = (payload) => {
    if (loading === false && payload !== undefined) {
      message.success("Thành công");
    }
  };
  const submitCole = () => {
    setDataNew([]);
    setNameFile();
    refInput.current.value = "";
  };


  const [isModalOpen, setIsModalOpen] = useState({ status: false, data: undefined });
  console.log(isModalOpen, 'isModalOpen')
  const showModal = () => {
    setIsModalOpen({ status: false, data: undefined });
  };
  const handleOk = () => {
    setIsModalOpen({ status: false, data: undefined });
  };
  const handleCancel = () => {
    setIsModalOpen({ status: false, data: undefined });
  };

  const [value, setValue] = useState();
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
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

    // {
    //   title: 'Người bán',
    //   dataIndex: 'seller',
    //   key: 'address',
    // },
    // {
    //   title: 'Người tạo',
    //   dataIndex: 'creator',
    //   key: 'address',
    // },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "address",
    },
    // {
    //   title: 'Tên hàng',
    //   dataIndex: 'name_pro',
    //   key: 'address',
    //   render: (name_pro) => <a>{name_pro}</a>,

    // },
    {
      title: "Địa chỉ (Khách hàng)",
      dataIndex: "address",
      key: "address",
      width: 400,
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
      width: 200,
      render: (status, data) => (
        <div className="status" onClick={() => {
          setIsModalOpen({ status: true, data: data })
          setValue(status)
        }}>
          {status == 0
            ? <span className="dvc">Đang vân chuyển</span>
            : status == 1
              ? <span className="cdh">Chờ duyệt hàng</span>
              : status == 2
                ? <span className="dg">Đang giao</span>
                : status == 3
                  ? <span className="hoan">Hoàn</span>
                  : <span className="susse">Thành công</span>}
        </div>
      ),
    },
  ];
  console.log(value, '3ewfdf')

  return (
    <div className="header">
      <h1 style={{textAlign:'center'}}>Danh sách khách hàng</h1>
      <Button>
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
      <Input type="file" onChange={(e) => importData(e)} id="up-file" />
      {dataNew.length > 0 && (
        <div className="mt-2 d-flex align-items-center justify-content-between">
          <Button
            style={{ width: "45%" }}
            onClick={() => submitSave()}
            type="primary"
          >
            Lưu
          </Button>
          <Button style={{ width: "45%" }} onClick={() => submitCole()}>
            Huỷ
          </Button>
        </div>
      )}
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

      <Modal title={<span style={{ fontSize: 20 }}>Cập nhật trạng thái</span>} open={isModalOpen.status} onOk={handleOk} onCancel={handleCancel} cancelText='Đóng' okText='Thay đổi'>
        <hr />
        <Radio.Group onChange={onChange} value={value} style={{ fontSize: 30 }} >
          <Radio style={{ fontSize: 18 }} value={0}>Đang vân chuyển</Radio><br />
          <Radio style={{ fontSize: 18 }} value={1}>Chờ duyệt hàng</Radio><br />
          <Radio style={{ fontSize: 18 }} value={2}>Đang giao</Radio><br />
          <Radio style={{ fontSize: 18 }} value={3}>Hoàn</Radio><br />
          <Radio style={{ fontSize: 18 }} value={4}>Thành công</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default App;
