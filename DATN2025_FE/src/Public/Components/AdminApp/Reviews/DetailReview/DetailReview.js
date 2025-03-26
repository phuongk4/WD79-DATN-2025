import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import reviewService from '../../../Service/ReviewService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

/**
 * DetailContact component
 *
 * @description Component for update review
 * @param {string} id - Id of review
 * @returns {ReactElement} DetailContact component
 */
function DetailReview() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [review, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches the review detail from the server and updates the component state
     * accordingly.
     * @function
     * @async
     * @returns {Promise<void>} A Promise that resolves when the data has been fetched and
     * the component state has been updated.
     */
    const detailReviews = async () => {
        await reviewService.detailReview(id)
            .then((res) => {
                setReviews(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    };

    useEffect(() => {
        detailReviews();
    }, [form, id, loading])


    /**
     * Handles the form submission of the detail review form.
     *
     * This function retrieves the values of the form fields, creates an update data object,
     * and sends a request to the server to update the review.
     *
     * If the request is successful, the component shows a success message and navigates to the
     * list of reviews.
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

        let updateData = {
            status: status
        }

        await reviewService.updateReview(id, updateData)
            .then((res) => {
                setLoading(false)
                console.log("data", res.data)
                alert("Thay đổi thành công")
                navigate("/admin/reviews/list")
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
                <h1>Chỉnh sửa đánh giá</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                        <li className="breadcrumb-item">Đánh giá</li>
                        <li className="breadcrumb-item active">Chỉnh sửa đánh giá</li>
                    </ol>
                </nav>
            </div>
            {/* End Page Title */}
            <section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Chỉnh sửa đánh giá</h5>
                                <Form onFinish={onFinish}>
                                    <div className="form-group">
                                        <label htmlFor="title">Tiêu đề</label>
                                        <input type="text" className="form-control" defaultValue={review.title}
                                               id="title" name="title"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="content">Nội dung</label>
                                        <textarea className="form-control" id="content" name="content"
                                                  defaultValue={review.content}
                                                  rows="5"></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="stars">Số sao</label>
                                            <input type="number" min="1" className="form-control"
                                                   defaultValue={review.stars}
                                                   id="stars" name="stars"/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="status">Trạng thái</label>
                                            <select id="status" name="status" className="form-select">
                                                <option selected={review.status === "CHỜ PHÊ DUYỆT"}
                                                        value="CHỜ PHÊ DUYỆT">CHỜ PHÊ DUYỆT
                                                </option>
                                                <option selected={review.status === "ĐƯỢC CHẤP NHẬN"}
                                                        value="ĐƯỢC CHẤP NHẬN">ĐƯỢC CHẤP NHẬN
                                                </option>
                                                <option selected={review.status === "ĐÃ TỪ CHỐI"}
                                                        value="ĐÃ TỪ CHỐI">ĐÃ TỪ CHỐI
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

export default DetailReview