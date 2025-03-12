import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import couponService from '../../../Service/CouponService';
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';

function CreateCoupon() {
    const navigate = useNavigate();
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

        await couponService.adminCreateCoupon(formData)
            .then((res) => {
                console.log("create property", res.data)
                message.success("Tạo mã giảm giá thành công!")
                navigate("/admin/coupons/list")
            })
            .catch((err) => {
                console.log(err)
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    useEffect(() => {

    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Giá trị thuộc tính</li>
                            <li className="breadcrumb-item active">Tạo mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo mã giảm giá</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên mã giảm giá</label>
                                            <input type="text" name="name" className="form-control" id="name" required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả mã giảm giá</label>
                                            <textarea name="description" id="description" className="form-control"
                                                      rows="10"></textarea>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="discount_percent">Phần trăm giảm giá</label>
                                                <input type="number" name="discount_percent" className="form-control"
                                                       id="discount_percent" min="0"
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="max_discount">Số tiền giảm giá tối đa</label>
                                                <input type="number" name="max_discount" className="form-control"
                                                       id="max_discount" min="0"
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="quantity">Tổng số lượng</label>
                                                <input type="number" name="quantity" className="form-control"
                                                       id="quantity" min="1"
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="max_set">Số lượng tối đa có thể lưu trong tài
                                                    khoản</label>
                                                <input type="number" name="max_set" className="form-control"
                                                       id="max_set" min="1"
                                                       required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="start_time">Ngày bắt đầu</label>
                                                <input type="datetime-local" name="start_time" className="form-control"
                                                       id="start_time" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="end_time">Ngày kết thúc</label>
                                                <input type="datetime-local" name="end_time" className="form-control"
                                                       id="end_time" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="min_total">Giá trị đơn hàng tối thiểu</label>
                                                <input type="number" name="min_total" className="form-control"
                                                       id="min_total" min="0"
                                                       required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thumbnail">Hình ảnh</label>
                                                <input type="file" name="thumbnail" className="form-control"
                                                       id="thumbnail" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="type">Loại mã giảm giá</label>
                                                <input type="text" name="type" className="form-control"
                                                       id="type"
                                                       required/>
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

export default CreateCoupon