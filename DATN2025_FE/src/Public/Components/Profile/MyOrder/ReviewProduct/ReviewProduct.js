import React, {useEffect, useState} from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import {Button, Form, Table} from 'antd';
import couponService from '../../../Service/CouponService';
import {Link, useParams, useSearchParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
import ConvertNumber from "../../../Shared/Utils/ConvertNumber";
import LoadingPage from "../../../Shared/Utils/LoadingPage";
import reviewService from "../../../Service/ReviewService";
import productService from "../../../Service/ProductService";

function ReviewProduct() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState([]);
    const [review, setReview] = useState([]);
    const [isReview, setIsReview] = useState(false);
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(true);

    let pro = searchParams.get('pro') ?? '';
    let or = searchParams.get('order') ?? '';

    const getProduct = async () => {
        await productService.detailProduct(pro)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.data.product);
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const checkReviewProduct = async () => {
        await reviewService.checkReviewByProduct(pro, or)
            .then((res) => {
                if (res.status === 200) {
                    let check = res.data.data;
                    console.log(check);
                    if (check.valid == true) {
                        setIsReview(true);
                        setOrder(check.order);
                        setReview(check.review);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const reviewProduct = async () => {
        LoadingPage();
        $('#btnSendReview').prop('disabled', true).text('Đang gửi đánh giá...');

        let inputs = $('#formReviewProduct input, #formReviewProduct textarea, #formReviewProduct select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') != 'radio' && $(inputs[i]).attr('type') != 'hidden') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnSendReview').prop('disabled', false).text('Gửi đánh giá');
                return
            }
        }

        const formData = new FormData($('#formReviewProduct')[0]);

        await reviewService.sendReview(formData)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res)
                    alert('Đánh giá sản phẩm thành công!')
                    LoadingPage();
                    window.history.back();
                }
            })
            .catch((err) => {
                alert('Đã xảy ra lỗi. Vui lòng thử lại sau')
                LoadingPage();
                console.log(err)
                $('#btnSendReview').prop('disabled', false).text('Gửi đánh giá');
            })
    }


    useEffect(() => {
        getProduct();
        checkReviewProduct();
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Đánh giá sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active">Đánh giá sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="p-2 bg-white">
                    {!isReview ? (
                        <div className="row">
                            <h5 className="text-start text-success mt-3">Đánh giá của bạn...</h5>
                            <Form id="formReviewProduct" onFinish={reviewProduct}>
                                <div className="form-group">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star} htmlFor={`option-${star}`} className="d-flex mr-3">
                                        <span className="d-inline-block mr-2" style={{position: 'relative', top: '0'}}>
                                            <input type="radio" id={`option-${star}`} value={star} name="stars"/>
                                        </span>
                                            <span className="d-inline-block text-black">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`fa-solid fa-star ${i < star ? '' : 'none_active'}`}
                                                ></i>
                                            ))}
                                                {star === 1
                                                    ? ' (Rất Tệ)'
                                                    : star === 2
                                                        ? ' (Tệ)'
                                                        : star === 3
                                                            ? ' (Bình thường)'
                                                            : star === 4
                                                                ? ' (Tốt)'
                                                                : ' (Rất Tốt)'}
                                        </span>
                                        </label>
                                    ))}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="title">Tiêu đề</label>
                                    <input type="text" className="form-control" id="title" name="title" required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">Nội dung</label>
                                    <textarea className="form-control" id="content" name="content" rows="5"></textarea>
                                </div>
                                <div className="d-none">
                                    <input type="hidden" id="order_id" name="order_id" value={or}/>
                                    <input type="hidden" id="product_id" name="product_id" value={pro}/>
                                </div>
                                <button type="submit" className="btn btn-secondary mt-2" id="btnSendReview">
                                    Gửi đánh giá
                                </button>
                            </Form>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="verified_customer_section mb-2">
                                <div className="image_review">
                                    <div className="customer_name_review_status">
                                        <div className="customer_name">Sản phẩm:
                                            <h4 className="">
                                                <a href={"/products/" + product.id}>{product.name}</a>
                                            </h4>
                                        </div>
                                        <div className="customer_review">
                                            Số sao: {Array.from({length: 5}).map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-solid fa-star ${i < review.stars ? 'filled' : ''}`}
                                            ></i>
                                        ))}
                                        </div>
                                    </div>
                                </div>

                                <h5>Tiêu đề: <b>{review.title}</b></h5>

                                <div className="customer_comment text_truncate_3_">
                                    Nội dung: {review.content}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

export default ReviewProduct