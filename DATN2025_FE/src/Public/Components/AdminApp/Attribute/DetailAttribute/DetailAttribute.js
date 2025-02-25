import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import attributeService from '../../../Service/AttributeService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

/**
 * DetailContact component
 *
 * @description Component for update attribute
 * @param {string} id - Id of attribute
 * @returns {ReactElement} DetailContact component
 */
function DetailAttribute() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [attribute, setAttribute] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the attribute detail from the server and updates the component state
     * accordingly.
     * @function
     * @async
     * @returns {Promise<void>} A Promise that resolves when the data has been fetched and
     * the component state has been updated.
     */
    const detailAttribute = async () => {
        await attributeService.adminDetailAttribute(id)
            .then((res) => {
                console.log("details category", res.data);
                setAttribute(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    };

    useEffect(() => {
        detailAttribute();
    }, [form, id, loading])


    /**
     * Handles the form submission of the detail attribute form.
     *
     * This function retrieves the values of the form fields, creates an update data object,
     * and sends a request to the server to update the attribute.
     *
     * If the request is successful, the component shows a success message and navigates to the
     * list of attributes.
     *
     * If the request fails, the component shows an error message.
     *
     * @function
     * @async
     * @returns {Promise<void>} A Promise that resolves when the request has been sent and the
     * component state has been updated.
     */
    const onFinish = async () => {
        setLoading(true)
        var status = document.getElementById("status").value;
        var name = document.getElementById("name").value;

        let updateData = {
            name: name, status: status
        }

        await attributeService.adminUpdateAttribute(id, updateData)
            .then((res) => {
                setLoading(false)
                console.log("data", res.data)
                alert("Thay đổi thành công")
                navigate("/admin/attributes/list")
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
                alert("Thay đổi thất bại")
            })
    };

    return (<>
        <Header/>
        <Sidebar/>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Chỉnh sửa thuộc tính</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                        <li className="breadcrumb-item">Thuộc tính</li>
                        <li className="breadcrumb-item active">Chỉnh sửa thuộc tính</li>
                    </ol>
                </nav>
            </div>
            {/* End Page Title */}
            <section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Chỉnh sửa thuộc tính</h5>
                                <Form onFinish={onFinish}>
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="name">Tên thuộc tính</label>
                                            <input type="text" className="form-control" id="name"
                                                   defaultValue={attribute.name} required/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="status">Trạng thái</label>
                                            <select id="status" name="status" className="form-select">
                                                <option selected={attribute.status === "ĐANG HOẠT ĐỘNG"}
                                                        value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG
                                                </option>
                                                <option selected={attribute.status === "KHÔNG HOẠT ĐỘNG"}
                                                        value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-3">Lưu lại</button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>)
}

export default DetailAttribute