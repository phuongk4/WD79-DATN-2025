import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import categoryService from '../../../Service/CategoryService';
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';

/**
 * Component for creating a new category.
 *
 * This component contains a form for creating a new category. The form
 * includes fields for the category name, thumbnail, parent category, and
 * status. When the form is submitted, the component sends a request to the
 * server to create a new category with the provided information.
 *
 * If the request is successful, the component shows a success message and
 * navigates to the list of categories.
 *
 * If the request fails, the component shows an error message.
 *
 * @return {ReactElement}
 */
function CreateCategory() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const onFinish = async () => {
        $('#btnCreate').prop('disabled', true).text('Đang tạo mới...');

        let inputs = $('#formCreate input, #formCreate textarea');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val()) {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
                return
            }
        }

        const formData = new FormData($('#formCreate')[0]);

        await categoryService.adminCreateCategory(formData)
            .then((res) => {
                console.log("create category", res.data)
                message.success("Tạo danh mục thành công!")
                navigate("/admin/categories/list")
            })
            .catch((err) => {
                console.log(err)
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    const getListCategory = async () => {
        await categoryService.adminListCategory()
            .then((res) => {
                if (res.status === 200) {
                    console.log("list category", res.data)
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
        getListCategory();
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo danh mục</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Tạo danh mục</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo danh mục</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" name="name" className="form-control" id="name" required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thumbnail">Hình ảnh</label>
                                                <input type="file" name="thumbnail" className="form-control"
                                                       id="thumbnail" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="parent_id">Danh mục cha</label>
                                                <select id="parent_id" name="parent_id" className="form-select">
                                                    <option value="">Chọn danh mục cha</option>
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

export default CreateCategory
