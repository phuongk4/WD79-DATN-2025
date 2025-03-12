import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, message} from 'antd';
import couponService from '../Service/CouponService';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import $ from 'jquery';

function Coupons() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getListCoupons = async () => {
        await couponService.listCoupon()
            .then((res) => {
                if (res.status === 200) {
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

    const saveCoupon = async (el) => {
        let coupon = $(el).data('id');
        let data = {
            coupon_id: coupon,
        };
        await couponService.saveCoupon(data)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res)
                    alert('Lưu mã giảm giá thành công')
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
                alert(err.response.data.message)
            })
    }


    useEffect(() => {
        getListCoupons();
    }, [loading]);

    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                            className="mx-2 mb-0">/</span> <strong className="text-black">Mã giảm giá</strong></div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="p-2 bg-white">

                        {data.map((coupon, index) => (
                            <div className="card mb-3 w-50 mt-3 ms-2">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src={coupon.thumbnail} style={{height: '100%'}}
                                             className="img-fluid rounded-start"
                                             alt={coupon.name}/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{coupon.name}</h5>
                                            <p className="card-text text_truncate_2_">
                                                {coupon.description}
                                            </p>

                                            <div className="d-flex align-items-center justify-content-end">
                                                <button style={{fontSize: '10px'}} type="button"
                                                        data-id={coupon.id}
                                                        onClick={(e) => saveCoupon(e.target)}
                                                        className="btn btn-primary mt-3">Lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>)
}

export default Coupons