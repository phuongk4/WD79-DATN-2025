import React, {useEffect, useState} from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import {Button, Form, Table} from 'antd';
import couponService from '../../../Service/CouponService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
import ConvertNumber from "../../../Shared/Utils/ConvertNumber";

function ListCoupon() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getListCoupons = async () => {
        await couponService.listMyCoupon()
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data)
                    console.log(data)
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
        getListCoupons();
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Mã giảm giá của tôi</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active">Mã giảm giá của tôi</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="p-2 bg-white">
                    {data.map((coupon, index) => (
                        <div className="card p-2 mb-3 w-50 mt-3 ms-2">
                            <div className="row g-0">
                                <div className="col-md-3">
                                    <img src={coupon.coupon.thumbnail} style={{height: '100%'}}
                                         className="img-fluid rounded-start"
                                         alt={coupon.coupon.name}/>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{coupon.coupon.name}</h5>
                                        <div className="font-weight-bold text-danger">{coupon.coupon.code}</div>
                                        <div>
                                            <p>Giảm giá: <span
                                                className="text-danger">{coupon.coupon.discount_percent}%</span> - Tối
                                                đa: <span
                                                    className="text-success ">{ConvertNumber(coupon.coupon.max_discount)}</span>
                                            </p>

                                        </div>
                                        <p className="card-text text_truncate_2_">
                                            {coupon.coupon.description}
                                        </p>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-end">
                                        <p className="btn btn-outline-primary mt-3">
                                            {coupon.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default ListCoupon