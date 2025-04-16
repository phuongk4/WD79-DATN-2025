import React, {useEffect, useState} from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import {Button, Form, Table, Spin} from 'antd';
import couponService from '../../../Service/CouponService';
import {Link, useParams, useSearchParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';
import ConvertNumber from "../../../Shared/Utils/ConvertNumber";
import reviewService from "../../../Service/ReviewService";
import productService from "../../../Service/ProductService";
import { message } from 'antd';

function ReviewProduct() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState([]);
    const [review, setReview] = useState([]);
    const [isReview, setIsReview] = useState(false);
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const pro = searchParams.get('pro') ?? '';
    const or = searchParams.get('order') ?? '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch product data
                const productRes = await productService.detailProduct(pro);
                if (productRes.status === 200) {
                    setProduct(productRes.data.data.product);
                }

                // Check review status
                const reviewRes = await reviewService.checkReviewByProduct(pro, or);
                if (reviewRes.status === 200) {
                    const check = reviewRes.data.data;
                    if (check.valid === true) {
                        setIsReview(true);
                        setOrder(check.order);
                        setReview(check.review);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        if (pro && or) {
            fetchData();
        }
    }, [pro, or]);

    const reviewProduct = async () => {
        try {
            setSubmitting(true);

            // Validate star rating
            const selectedStar = $('input[name="stars"]:checked').val();
            if (!selectedStar) {
                message.error('Vui lòng chọn số sao đánh giá!');
                return;
            }

            // Get form values
            const title = $('#title').val();
            const content = $('#content').val();
            const order_id = $('#order_id').val();
            const product_id = $('#product_id').val();

            // Validate required fields
            if (!title.trim()) {
                message.error('Tiêu đề không được bỏ trống!');
                return;
            }

            if (!content.trim()) {
                message.error('Nội dung không được bỏ trống!');
                return;
            }

            // Create review data object
            const reviewData = {
                stars: parseInt(selectedStar),
                title: title.trim(),
                content: content.trim(),
                order_id: parseInt(order_id),
                product_id: parseInt(product_id)
            };

            // Send review
            const response = await reviewService.sendReview(reviewData);
            
            if (response.status === 200) {
                message.success('Đánh giá sản phẩm thành công!');
                window.history.back();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            message.error('Đã xảy ra lỗi. Vui lòng thử lại sau');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading-container">
            <Spin size="large" />
            <span className="ms-2">Đang tải...</span>
        </div>;
    }

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
                                <button type="submit" className="btn btn-secondary mt-2" id="btnSendReview" disabled={submitting}>
                                    {submitting ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
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