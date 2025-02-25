import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import attributeService from '../../../Service/AttributeService';
import {Link, useNavigate} from 'react-router-dom'

/**
 * Page for creating a new attribute.
 *
 * This page contains a form with fields for attribute name and status.
 * After submitting the form, the page will call the API to create a new attribute,
 * and if the API call is successful, it will redirect to the list of attributes.
 *
 * @return {React.ReactElement} The page for creating a new attribute.
 */
function CreateAttribute() {
    const navigate = useNavigate();

    /**
     * Function to be called when the form is submitted.
     *
     * This function will retrieve the values of the form fields, create a new attribute,
     * and if the API call is successful, it will redirect to the list of attributes.
     *
     * @return {Promise<void>} The promise of the function.
     */
    const onFinish = async () => {
        var name = document.getElementById("name").value;
        var status = document.getElementById("status").value;

        let data = {
            name: name,
            status: status,
        }

        await attributeService.adminCreateAttribute(data)
            .then((res) => {
                console.log("create attribute", res.data)
                message.success("Tạo thành công!")
                navigate("/admin/attributes/list")
            })
            .catch((err) => {
                console.log(err)
            })
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo thuộc tính</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Thuộc tính</li>
                            <li className="breadcrumb-item active">Tạo thuộc tính</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo thuộc tính</h5>
                                    <Form onFinish={onFinish}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="name">Tên thuộc tính</label>
                                                <input type="text" className="form-control" id="name" required/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" className="form-select">
                                                    <option value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG</option>
                                                    <option value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3">Tạo mới</button>
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

export default CreateAttribute