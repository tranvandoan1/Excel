import { Button, Input, Modal, Segmented, Select, Spin, Table, message } from 'antd'
import './dataFashion.css'
import moment from 'moment';
import { startTransition, useEffect, useState } from 'react';
import AddData from './AddData';
import Note from './Note';
import { useDispatch, useSelector } from 'react-redux';
import { addDataDataFashionF, getAllDataFashionF, uploadDataDataFashionF } from '../features/dataFashion';
import Loading from '../Loading';
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
function validatePhoneNumber(phoneNumber) {
    // Regex để kiểm tra số điện thoại có đúng định dạng hay không
    const phonePattern = /^\d{10}$/; // Định dạng 10 chữ số

    // Kiểm tra số điện thoại với regex
    if (phonePattern.test(phoneNumber)) {
        return true; // Số điện thoại hợp lệ
    } else {
        return false; // Số điện thoại không hợp lệ
    }
}
function getAllDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push({
            label: `Ngày ${day}`,
            value: day
        });
    }

    return daysArray;
}
const date = moment().date();
const month = moment().month() + 1;
const year = moment().year();
function validateDate(item) {
    if (String(item).length <= 1) {
        return `Tháng 0${item}`
    } else {
        return `Tháng ${item}`

    }
}
const DataFashion = () => {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(false);
    const [addYear, setAddYear] = useState(year);
    const [selectMonth, setSelectMonth] = useState(month);
    const [valuePhone, setValuePhone] = useState('');
    const [dataSum, setDataSum] = useState([]);
    const [tab, setTab] = useState('DATA');
    const [filterPhone, setFilterPhone] = useState();


    const [stateDate, setStateDate] = useState(date);
    const [stateMonth, setStateMonth] = useState(month);
    const [stateYear, setStateYear] = useState(year);



    const dispatch = useDispatch();
    const dataFashion = useSelector((data) => data.dataFashion.value);
    // lấy dữ liệu tháng
    const dataFashionind = dataFashion?.data?.find(item => item?.month == stateMonth && item?.year == year)
    const dataFashionindDate = dataFashionind?.data == undefined ? [] : JSON.parse(dataFashionind?.data)?.filter(item => item.date == stateDate)
    const dataFashionindDateNoAdress = dataFashionindDate?.filter(item => String(item.address).length <= 0)

    const handleChangeMonth = (value) => {
        if (value == month) {
            setStateMonth(value)
            setStateDate(date)
        } else {
            setStateMonth(value)
            setStateDate(1)
        }
    };
    const handleChangeDate = (value) => {

        setStateDate(value)

    };

    const handleChangeImport = (value) => {
        setStateMonth(value)


    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        setLoading(true)
        await dispatch(addDataDataFashionF({ month: stateMonth, year: addYear, data: [] }))
        setLoading(false)
        setStateMonth()
        setAddYear()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        dispatch(getAllDataFashionF())
    }, [])


    const savePhone = async () => {
        if (!validatePhoneNumber(valuePhone)) {
            setValuePhone('')
            message.warning('Số điện thoại không đúng')
        } else {
            // setLoading(true)
            const newData = {
                id: Math.random(),
                phone: valuePhone,
                address: '',
                note: '',
                date: date,
                status: false
            }
            const checkPhone = dataFashionindDate?.find(item => item.phone == valuePhone)

            if (checkPhone) {
                message.warning('có rồi')
            } else {
                setLoading(true)
                const data = { ...dataFashionind, data: JSON.stringify([...JSON.parse(dataFashionind.data), newData]) }
                await dispatch(uploadDataDataFashionF({ data: data }))
                message.success('Thêm thành công')
                setValuePhone('')
                setLoading(false)
            }

        }
    }

    const btAt = async (e) => {
        setLoading(true)
        const data = { ...dataFashionind, data: JSON.stringify(e) }
        await dispatch(uploadDataDataFashionF({ data: data }))
        setLoading(false)
        message.success('Xóa thành công')

    }

    const btnComfimAdres = async (e) => {
        // if (String(e.data.address).length <= 0) 
        if (String(e.value).length <= 0) {

            message.warning('Chưa nhập gì !')

        } else {
            // setLoading(true)
            const dataCheck = JSON.parse(dataFashionind?.data)
            for (let i = 0; i < dataCheck.length; i++) {
                if (e.data.id == dataCheck[i].id) {
                    dataCheck[i].address = e.value
                }
            }
            const data = { ...dataFashionind, data: JSON.stringify(dataCheck) }
            await dispatch(uploadDataDataFashionF({ data: data }))
            setLoading(false)
            message.success('Upload thành công')
        }
    }

    const btnComfimNote = async (e) => {
        // if (String(e.data.address).length <= 0) 
        if (String(e.value).length <= 0) {

            message.warning('Chưa nhập gì !')

        } else {
            // setLoading(true)
            const dataCheck = JSON.parse(dataFashionind?.data)
            for (let i = 0; i < dataCheck.length; i++) {
                if (e.data.id == dataCheck[i].id) {
                    dataCheck[i].note = e.value
                }
            }
            const data = { ...dataFashionind, data: JSON.stringify(dataCheck) }
            await dispatch(uploadDataDataFashionF({ data: data }))
            setLoading(false)
            message.success('Upload thành công')
        }
    }


    const searchPhone = (e) => {
        const dataPhoneFilter = dataFashionindDate?.filter(item => item.phone == filterPhone)
        if (!validatePhoneNumber(filterPhone)) {
            message.warning('Số điện thoại không đúng')
            setValuePhone('')
            setFilterPhone()
        } else if (dataPhoneFilter?.length <= 0) {
            message.warning('Upload thành công')
        } else {
            // console.log(dataPhoneFilter, 'dataPhoneFiltersdsqw')
            setDataSum(dataPhoneFilter)
        }
    }

    return (
        <div className='dataFashion-main'>
            {
                loading == true ?
                    <Loading />
                    : ''
            }
            {/* tạo tháng mới*/}

            <div className='dataFashion-header'>
                <h2>Danh sách</h2>
                <div>
                    <Select
                        defaultValue={validateDate(selectMonth)}
                        style={{ width: 120 }}
                        onChange={handleChangeMonth}
                        options={dataMonth}
                    />
                    <Select
                        value={stateDate}
                        style={{ width: 120, marginLeft: 10 }}
                        onChange={handleChangeDate}
                        options={getAllDaysInMonth(stateYear, stateMonth)}
                    />
                </div>

                <Button
                    disabled={(dataFashionind == undefined || dataFashionind == null) ? false : true}
                    onClick={showModal}>Thêm dữ liệu</Button>
            </div>
            <br />
            <br />



            {/* thêm su dữ liệu */}

            <div className='dataFashion-add'>
                <div className='dataFashion-add-phone'>
                    <Input style={{ width: 300, marginRight: 10 }} disabled={tab !== 'DATA' ? true : false} placeholder="Thêm số điện thoại"
                        value={valuePhone}
                        onChange={(e) => {
                            startTransition(() => {
                                setValuePhone(e.target.value)
                            })
                        }}
                        allowClear
                    />
                    <Button disabled={tab !== 'DATA' ? true : false} type='primary' onClick={() => savePhone()}>Thêm Số</Button>

                </div>
                <div>
                    <Segmented
                        options={['DATA', 'NOTE']}
                        onChange={(value) => {
                            setTab(value) // string
                        }}
                    />
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}> <h3 style={{ marginRight: 20 }}>Tổng đơn</h3>
                        <span>  {
                            dataFashionindDate?.length
                        }</span></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}> <h3 style={{ marginRight: 20 }}>Tổng đơn chưa có đ/c</h3>
                        <span style={{ color: 'red', fontSize: 20, fontWeight: 700, marginRight: 20 }}>  {dataFashionindDateNoAdress?.length}</span>

                        <Button disabled={tab !== 'DATA' ? true : false} type={filter == true ? 'default' : 'primary'} onClick={() => setFilter(!filter)}>Lọc</Button>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input onMouseUp={() => setFilter(false)} style={{ marginRight: 10 }} placeholder='Tìm kiếm ...' onChange={(e) => setFilterPhone(e.target.value)} value={filterPhone} />
                    <Button type='primary' onClick={() => searchPhone()}>Tìm</Button>
                    {
                        dataSum?.length > 0 &&
                        <Button type='primary' style={{ marginLeft: 10 }} danger onClick={() => {
                            setDataSum([])
                            setFilterPhone()
                        }}>Xóa</Button>

                    }
                </div>
            </div>
            {/* hiện dữ liệu */}
            <br />
            <br />
            <div>
                {
                    tab == 'DATA' ?

                        <AddData dataFashion={filter == true ? dataFashionindDateNoAdress : dataSum?.length > 0 ? dataSum : dataFashionindDate}
                            btnComfim={(e) => btAt(e)}
                            btnComfimAdres={(e) => btnComfimAdres(e)}
                            btnComfimNote={(e) => btnComfimNote(e)}
                        />
                        :
                        <Note dataFashion={JSON.parse(dataFashionind?.data)} />
                }
            </div>

            <Modal title="Thêm tháng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                okText='Thêm'
                cancelText='Hủy'
            >
                <div className='modal-import-data'>
                    <Select
                        defaultValue={stateMonth}
                        style={{ width: 120, marginRight: 20 }}
                        onChange={handleChangeImport}
                        options={dataMonth}
                    />
                    <Input placeholder='Nhập năm...'
                        defaultValue={addYear}
                        onChange={(e) => {
                            startTransition(() => {
                                setAddYear(e.target.value)
                            })
                        }}
                    />
                </div>

            </Modal>
        </div>
    )
}

export default DataFashion