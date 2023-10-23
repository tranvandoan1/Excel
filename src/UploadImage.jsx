import React, { useEffect, useState } from "react";
import "./uploadImage.css";
import {
    CloseOutlined,
    DeleteOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Checkbox, Col, Input, Modal, Row, message } from "antd";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { getImage, upload_image } from "./features/dataMonthSlice";
import Loading from "./Loading";
const UploadImage = () => {
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoanding] = useState(false);

    const onDrop = (acceptedFiles) => {
        setLoanding(true)
        console.log(acceptedFiles.length, '23rewf')
        const newData = [...images]
        acceptedFiles?.map(item => {
            newData.push({ _id: Math.random(), image: item })
        })
        if (newData?.length > 50) {
            message.warning('Chỉ có thể chọn 50 trong 1 lần !')
            setImages([...newData.slice(0, 50)]);
            setIsModalOpen(true);
        } else {

            setImages([...newData]);
            setIsModalOpen(true);
        }
        setLoanding(false)

    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    const dataImages = useSelector((data) => data.dataMonth.valueImage);
    useEffect(() => {
        dispatch(getImage());
    }, []);
    const closeImage = (e) => {
        setLoanding(true)
        const newData = images.filter(item => item._id !== e._id)
        setImages(newData);
        setLoanding(false)
    };

    const handleOk = async () => {
        setLoanding(true)
        const formData = new FormData()
        for (let i = 0; i < images.length; i++) {
            console.log(images[i].image, ' images[i].image')
            formData.append('files', images[i].image)
        }
        await dispatch(upload_image(formData))
        setIsModalOpen(false);
        setLoanding(false)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="image-box">
                 {
                loading == true &&
                <Loading />
            }
            <div className="header">
                <h3>Upload Image</h3>
                <div className="avatar">
                    <Avatar size={34} icon={<UserOutlined />} />
                    <span style={{ marginLeft: 10 }}>Trần Văn Đoàn</span>
                </div>
            </div>
            {/* <div>
                <Button style={{ cursor: "pointer" }}>
                    <label htmlFor="up-file">
                        <div className="buttonUpfile">
                            <UploadOutlined className="icon" /> Upload Image
                        </div>
                    </label>
                </Button>
                <Input
                    multiple
                    type="file"
                    onChange={(e) => {
                        console.log(e, 'e3wfd')
                    }}
                    id="up-file"
                />
            </div> */}
            <div className="upload-button">
                <div {...getRootProps()} style={{ cursor: "pointer" }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div className="image-uload">
                            <UploadOutlined className="icon" />
                            <p style={{ marginLeft: 10 }}>Thả các tệp ảnh vào đây ...</p>
                        </div>
                    ) : (
                        <div className="image-uload">
                            <UploadOutlined className="icon" />
                            <p style={{ marginLeft: 10 }}>
                                Kéo và thả các tệp ảnh vào đây hoặc nhấp để chọn tệp ảnh
                            </p>
                        </div>
                    )}
                </div>
                <div className="icon-delete">
                    <Checkbox onChange={onChange}>Tất cả</Checkbox>
                    <DeleteOutlined style={{ cursor: "pointer" }} />
                </div>
            </div>
            <hr />
            {/* 
            <Row gutter={16}>
                <div>
                    {images.map((image, index) => (
                        <div key={index} className="">
                            <Col
                                xs={12}
                                sm={4}
                                md={12}
                                lg={4}
                                xl={4}
                                style={{ textAlign: "left", padding: "0 30px" }}
                            >
                                <img src={URL.createObjectURL(image)} alt={image.name} />

                            </Col>
                        </div>
                    ))}
                </div>
            </Row> */}

            {dataImages?.data?.length <= 0 ? (
                <span>Chưa có ảnh nào</span>
            ) : (
                <Row gutter={16}>
                    {dataImages?.data?.map((image, index) => (
                        <Col xs={12} sm={12} md={12} lg={4} xl={4} key={index}>
                            <div className="image">
                                <img src={URL.createObjectURL(image.image)} alt={image.image.name} />
                            </div>
                        </Col>
                    ))}
                </Row>
            )}


            <Modal title="Check lại ảnh muốn upload" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Đồng ý' cancelText='Hủy'>
                <div className="upload-button">
                    <div {...getRootProps()} style={{ cursor: "pointer" }}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="image-uload">
                                <UploadOutlined className="icon" />
                                <p style={{ marginLeft: 10 }}>Thả các tệp ảnh vào đây ...</p>
                            </div>
                        ) : (
                            <div className="image-uload">
                                <UploadOutlined className="icon" />
                                <p style={{ marginLeft: 10 }}>
                                    Kéo và thả các tệp ảnh vào đây hoặc nhấp để chọn tệp ảnh
                                </p>
                            </div>
                        )}
                    </div>

                </div>
                <div className="show-image">
                    <Row gutter={24}>
                        {images.map((image, index) => (
                            <Col xs={12} sm={12} md={12} lg={4} xl={4} key={index}>
                                <div style={{ position: 'relative' }}>
                                    <CloseOutlined className="close" onClick={() => closeImage(image)} />
                                    <div className="image">
                                        <img src={URL.createObjectURL(image.image)} alt={image.image.name} />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default UploadImage;
