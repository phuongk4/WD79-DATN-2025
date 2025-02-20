import React from 'react';
import {Link} from 'react-router-dom';
import {Form} from 'antd';
import authService from '../../Service/AuthService';
import $ from "jquery";
import Script from "../../Shared/Admin/Lib/Script";
import Css from "../../Shared/Admin/Lib/StyleSheet";

function ForgotPassword() {
    const onFinish = async () => {
        $('#btnSend').prop('disabled', false).text('Đang gửi...');

        let email = $('#yourEmail').val();

        let data = {
            email: email,
            username: "string",
            password: "string",
            confirmPassword: "string"
        }
        await authService.forgotPassword(data)
            .then((res) => {
                localStorage.setItem("email", data.email);
                alert('Thành công! Vui lòng kiểm tra mã xác minh gửi đến email của bạn...');
                window.location.href = '/change-password';
            })
            .catch((err) => {
                console.log(err.response.data);
                alert(`Xác minh thất bại! ` + err.response.data.message);
                $('#btnSend').prop('disabled', false).text('Gửi');
            })
    };

    return (
        <>
            <Css/>
            <main>
                <div className="container">

                    <section
                        className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div
                                    className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                    <div className="d-flex justify-content-center py-4">
                                        <a href="/" className="logo d-flex align-items-center w-auto">
                                            <img src="/assets/admin/img/logo.png" alt=""></img>
                                            <span className="d-none d-lg-block">SoleVibe</span>
                                        </a>
                                    </div>

                                    <div className="card mb-3">

                                        <div className="card-body">

                                            <div className="pt-4 pb-2">
                                                <h5 className="card-title text-center pb-0 fs-4">Tìm tài khoản</h5>
                                                <p className="text-center small">Nhập email để tìm tài khoản của bạn</p>
                                            </div>

                                            <Form className="row g-3 needs-validation" onFinish={onFinish}>
                                                <div className="col-12">
                                                    <label htmlFor="yourEmail" className="form-label">Email</label>
                                                    <input type="email" name="yourEmail" className="form-control"
                                                           id="yourEmail" required/>
                                                    <div className="invalid-feedback">Vui lòng nhập email.</div>
                                                </div>

                                                <div className="col-12">
                                                    <button id="btnSend" className="btn btn-primary w-100"
                                                            type="submit">Gửi
                                                    </button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0">Bạn đã có tài khoản <a
                                                        href="/login">Đăng nhập ngay</a></p>
                                                </div>
                                            </Form>

                                        </div>
                                    </div>

                                    <div className="credits">
                                        Thiết kế bởi <Link to="#">SoleVibe Developer Team</Link>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </main>
            <Script/>
        </>
    )
}

export default ForgotPassword
