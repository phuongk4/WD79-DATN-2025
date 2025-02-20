import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import categoryService from '../../../Service/CategoryService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

function DetailCategory() {
    const [category, setCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();

    const detailCategory = async () => {
        await categoryService.adminDetailCategory(id)
            .then((res) => {
                console.log("detail category", res.data);
                setCategory(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    const getListCategory = async () => {
        await categoryService.adminListCategory()
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    setCategories(res.data.data)
                    setLoading(false)
                } else {
                    alert(res.data.message)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        detailCategory();
        getListCategory();
    }, [form, id, loading])

    return (<>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chi tiết danh mục</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Chi tiết danh mục</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chi tiết danh mục</h5>
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   value={category.name} disabled required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <img src={category.thumbnail} alt={category.name} width="200px"
                                                     className="mt-2"/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="parent_id">Danh mục cha</label>
                                                <select id="parent_id" name="parent_id" className="form-select" disabled>
                                                    <option value="">Chọn danh mục cha</option>
                                                    {categories.map((item, index) => {
                                                        if (item.id === category.parent_id) {
                                                            return (<option selected
                                                                            value={item.id}>{item.name}</option>)
                                                        } else {
                                                            return (<option value={item.id}>{item.name}</option>)
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" name="status" className="form-select" disabled>
                                                    <option selected={category.status === "ĐANG HOẠT ĐỘNG"}
                                                            value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG
                                                    </option>
                                                    <option selected={category.status === "KHÔNG HOẠT ĐỘNG"}
                                                            value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <a href={'/admin/categories/update/' + id} className="btn btn-primary mt-3">Chỉnh
                                            sửa
                                        </a>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>)
}

export default DetailCategory
