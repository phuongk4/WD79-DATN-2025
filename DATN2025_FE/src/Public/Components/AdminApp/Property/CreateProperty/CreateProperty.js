import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import propertyService from '../../../Service/PropertyService';
import attributeService from '../../../Service/AttributeService';
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';

function CreateProperty() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const onFinish = async () => {
        $('#btnCreate').prop('disabled', true).text('Đang tạo mới...');

        let inputs = $('#formCreate input, #formCreate textarea, #formCreate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val()) {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
                return
            }
        }

        const formData = new FormData($('#formCreate')[0]);

        await propertyService.adminCreateProperty(formData)
            .then((res) => {
                console.log("create property", res.data)
                message.success("Tạo giá trị thuộc tính thành công!")
                navigate("/admin/properties/list")
            })
            .catch((err) => {
                console.log(err)
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    const getListAttribute = async () => {
        await attributeService.adminListAttribute()
            .then((res) => {
                if (res.status === 200) {
                    console.log("list attribute", res.data)
                    setData(res.data.data)
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
        getListAttribute();
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo giá trị thuộc tính</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Giá trị thuộc tính</li>
                            <li className="breadcrumb-item active">Tạo giá trị thuộc tính</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo giá trị thuộc tính</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên giá trị thuộc tính</label>
                                            <input type="text" name="name" className="form-control" id="name" required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thumbnail">Hình ảnh</label>
                                                <input type="file" name="thumbnail" className="form-control"
                                                       id="thumbnail" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="attribute_id">Thuộc tính cha</label>
                                                <select id="attribute_id" name="attribute_id" className="form-select">
                                                    <option value="">Chọn giá trị thuộc tính cha</option>
                                                    {
                                                        data.map((item, index) => {
                                                            return (
                                                                <option value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" name="status" className="form-select">
                                                    <option value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG</option>
                                                    <option value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" id="btnCreate" className="btn btn-primary mt-3">Tạo
                                            mới
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

export default CreateProperty