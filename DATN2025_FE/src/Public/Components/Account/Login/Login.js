import React from 'react';
import {Link} from 'react-router-dom';
import {Form, Input} from 'antd';
import authService from '../../Service/AuthService';
import $ from 'jquery';
import Css from '../../Shared/Admin/Lib/StyleSheet';
import Script from '../../Shared/Admin/Lib/Script';

function Login() {
    const onFinish = async () => {
        let login_request = document.getElementById('login_request').value;
        let password = document.getElementById('password').value;

        $('#btnLogin').prop('disabled', true).text('Đang đăng nhập...');

        let data = {
            login_request: login_request,
            password: password
        }
        await authService.loginAccount(data)
            .then((res) => {
                sessionStorage.setItem("accessToken", res.data.accessToken);
                sessionStorage.setItem("id", res.data.id);
                sessionStorage.setItem("email", res.data.email);
                sessionStorage.setItem("name", res.data.full_name);
                sessionStorage.setItem("role", res.data.role);
                alert(`Xin chào ${res.data.full_name} !`);
                if (res.data.role === 'ADMIN') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                console.log(err.response.data);
                alert(`Đăng nhập thất bại! ` + err.response.data.message);
                $('#btnLogin').prop('disabled', false).text('Đăng nhập');
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
                                                <h5 className="card-title text-center pb-0 fs-4">Đăng nhập vào tài khoản
                                                    của bạn</h5>
                                                <p className="text-center small">Nhập email hoặc số điện thoại và mật
                                                    khẩu của bạn để
                                                    đăng nhập</p>
                                            </div>

                                            <Form className="row g-3 needs-validation" onFinish={onFinish}>
                                                <div className="col-12">
                                                    <label htmlFor="login_request" className="form-label">Email hoặc số
                                                        điện thoại</label>
                                                    <input className="form-control" id="login_request"
                                                           type="text" placeholder="Enter your phone or email"
                                                           required/>
                                                    <div className="invalid-feedback">Vui lòng điền email hoặc số điện
                                                        thoại.
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                    <input required className="form-control" id="password"
                                                           type="password" placeholder="Enter your password"/>
                                                    <div className="invalid-feedback">Vui lòng nhập mật khẩu của bạn!
                                                    </div>
                                                </div>

                                                <div
                                                    className="col-12 d-flex justify-content-end align-items-center">
                                                    <a href="/forgot-password">Quên mật khẩu?</a>
                                                </div>
                                                <div className="col-12">
                                                    <button id="btnLogin" className="btn btn-primary w-100"
                                                            type="submit">Đăng nhập
                                                    </button>
                                                </div>
                                                <div className="col-12">
                                                    <p className="small mb-0">Bạn chưa có tài khoản?
                                                        <a href="/register">Tạo tài khoản ngay</a>
                                                    </p>
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

export default Login
