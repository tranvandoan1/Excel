import { DeleteOutlined, EyeOutlined, MinusOutlined } from '@ant-design/icons';
import { Input, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'

const AddData = ({
    dataFashion, btnComfim, btnComfimAdres,btnComfimNote
}) => {

    const deleteDate = (dataSelect) => {
        const newData = dataFashion?.filter(item => item.id !== dataSelect.id)
        btnComfim(newData)
    }


    const saveAddress = (e) => {
        if (String(e).length <= 0) {
            message.warning('Chưa nhập gì')
        } else {
            btnComfimAdres(e)
        }
    }
    const saveNote = (e) => {
        if (String(e).length <= 0) {
            message.warning('Chưa nhập gì')
        } else {
            btnComfimNote(e)
        }
    }


    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (phone, data, index) => (
                <div style={{ textAlign: 'center' }}>
                    <span >
                        {index + 1}
                    </span>
                </div>
            ),
            width: '5%'
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone, data, index) => (
                <div>
                    <Input defaultValue={phone} />
                </div>
            ),
            width: '20%'
        },
        {
            title: 'ĐỊA CHỈ',
            dataIndex: 'address',
            key: 'address',
            render: (address, data, index) => (
                <div>
                    <Input defaultValue={address} placeholder='Nhập địa chỉ ...' onBlur={(e) => saveAddress({ data: data, value: e.target.value })} />
                </div>
            ),
            width: '50%'
        },
        {
            title: 'NOTE',
            dataIndex: 'note',
            key: 'note',
            render: (note, data, index) => (
                <div>
                    <Input defaultValue={note} placeholder='Nhập ghi chú ...' onBlur={(e) => saveNote({ data: data, value: e.target.value })} />

                </div>
            ),
            width: '15%'
        },
        {
            title: 'THAO TÁC',
            dataIndex: 'id',
            key: 'id',
            render: (id, data, index) => (
                <div className='manipulation'>
                    <div className='EyeOutlined'>
                        <EyeOutlined style={{ cursor: "pointer" }} />

                    </div>
                    <div className='DeleteOutlined'>
                        <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => deleteDate(data)} />

                    </div>
                </div>
            ),
            width: '10%'
        },
    ];

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

  
  };

    return (
        <div>
            {/* <Table dataSource={dataFashion.slice().reverse()} columns={columns} />; */}
            <Table
                columns={columns}
                rowKey={(item) => item.id}
                style={{ textAlign: "center" }}
                dataSource={dataFashion}
                pagination={tableParams.pagination}
                // scroll={{ y: 450 }}
                onChange={handleTableChange}
                bordered
            />
        </div>
    )
}

export default AddData