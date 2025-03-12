import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import couponService from '../../../Service/CouponService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

function DetailCoupon() {
    const [coupon, setCoupon] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const detailCoupon = async () => {
        await couponService.adminDetailCoupon(id)
            .then((res) => {
                console.log("detail coupon", res.data);
                setCoupon(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    useEffect(() => {
        detailCoupon();
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

        await couponService.adminUpdateCoupon(id, formData)
            .then((res) => {
                message.success("Thay đổi thành công")
                navigate("/admin/coupons/list")
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
                    <h1>Chỉnh sửa mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Mã giảm giá</li>
                            <li className="breadcrumb-item active">Chỉnh sửa mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa mã giảm giá</h5>
                                    <Form onFinish={onFinish} id="formUpdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên mã giảm giá</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   defaultValue={coupon.name} required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả mã giảm giá</label>
                                            <textarea name="description" id="description" className="form-control"
                                                      defaultValue={coupon.description}
                                                      rows="10"></textarea>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="discount_percent">Phần trăm giảm giá</label>
                                                <input type="number" name="discount_percent" className="form-control"
                                                       id="discount_percent" min="0" defaultValue={coupon.discount_percent}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="max_discount">Số tiền giảm giá tối đa</label>
                                                <input type="number" name="max_discount" className="form-control"
                                                       id="max_discount" min="0" defaultValue={coupon.max_discount}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="quantity">Tổng số lượng</label>
                                                <input type="number" name="quantity" className="form-control"
                                                       id="quantity" min="1" defaultValue={coupon.quantity}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label htmlFor="max_set">Số lượng tối đa có thể lưu trong tài
                                                    khoản</label>
                                                <input type="number" name="max_set" className="form-control"
                                                       id="max_set" min="1" defaultValue={coupon.max_set}
                                                       required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="start_time">Ngày bắt đầu</label>
                                                <input type="datetime-local" name="start_time" className="form-control"
                                                       defaultValue={coupon.start_time}
                                                       id="start_time" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="end_time">Ngày kết thúc</label>
                                                <input type="datetime-local" name="end_time" className="form-control"
                                                       defaultValue={coupon.end_time}
                                                       id="end_time" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="min_total">Giá trị đơn hàng tối thiểu</label>
                                                <input type="number" name="min_total" className="form-control"
                                                       id="min_total" min="0" defaultValue={coupon.min_total}
                                                       required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="thumbnail">Hình ảnh</label>
                                                <input type="file" name="thumbnail" className="form-control"
                                                       id="thumbnail"/>

                                                <img src={coupon.thumbnail} alt={coupon.name} width="200px"
                                                     className="mt-2"/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="type">Loại mã giảm giá</label>
                                                <input type="text" name="type" className="form-control"
                                                       id="type" defaultValue={coupon.type}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" name="status" className="form-select">
                                                    <option selected={coupon.status === "ĐANG HOẠT ĐỘNG"}
                                                            value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG
                                                    </option>
                                                    <option selected={coupon.status === "KHÔNG HOẠT ĐỘNG"}
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

export default DetailCoupon