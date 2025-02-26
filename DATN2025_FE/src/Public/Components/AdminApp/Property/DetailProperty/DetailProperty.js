import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import propertyService from '../../../Service/PropertyService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';
import attributeService from "../../../Service/AttributeService";

function DetailProperty() {
    const [property, setProperty] = useState([]);
    const [attributes, setAttribute] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const detailProperty = async () => {
        await propertyService.adminDetailProperty(id)
            .then((res) => {
                console.log("detail property", res.data);
                setProperty(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    const getListAttribute = async () => {
        await attributeService.adminListAttribute()
            .then((res) => {
                if (res.status === 200) {
                    console.log("list attribute", res.data)
                    setAttribute(res.data.data)
                    setLoading(false)
                } else {
                    alert('Error')
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        detailProperty();
        getListAttribute();
    }, [form, id, loading])


    const onFinish = async () => {
        $('#btnUpdate').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdate input, #formUpdate textarea, #formUpdate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
                return
            }
        }

        const formData = new FormData($('#formUpdate')[0]);

        await propertyService.adminUpdateProperty(id, formData)
            .then((res) => {
                message.success("Thay đổi thành công")
                navigate("/admin/properties/list")
            })
            .catch((err) => {
                console.log(err)
                alert(err.response.data.message)
                $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
            })
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa giá trị thuộc tính</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Chỉnh sửa giá trị thuộc tính</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa giá trị thuộc tính</h5>
                                    <Form onFinish={onFinish} id="formUpdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên giá trị thuộc tính</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   defaultValue={property.name} required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thumbnail">Hình ảnh</label>
                                                <input type="file" name="thumbnail" className="form-control"
                                                       id="thumbnail"/>

                                                <img src={property.thumbnail} alt={property.name} width="200px"
                                                     className="mt-2"/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="attribute_id">Thuộc tính cha</label>
                                                <select id="attribute_id" name="attribute_id" className="form-select">
                                                    <option value="">Chọn thuộc tính cha</option>
                                                    {
                                                        attributes.map((item, index) => {
                                                            if (item.id === property.attribute_id) {
                                                                return (
                                                                    <option selected
                                                                            value={item.id}>{item.name}</option>
                                                                )
                                                            } else {
                                                                return (
                                                                    <option value={item.id}>{item.name}</option>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" name="status" className="form-select">
                                                    <option selected={property.status === "ĐANG HOẠT ĐỘNG"}
                                                            value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG
                                                    </option>
                                                    <option selected={property.status === "KHÔNG HOẠT ĐỘNG"}
                                                            value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" id="btnUpdate" className="btn btn-primary mt-3">Lưu lại
                                        </button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default DetailProperty