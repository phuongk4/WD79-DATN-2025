import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Form, Input, message} from 'antd';
import authService from '../../Service/AuthService';
import $ from "jquery";
import Script from "../../Shared/Admin/Lib/Script";
import Css from "../../Shared/Admin/Lib/StyleSheet";

function ChangePassword() {
    const onFinish = async () => {
        $('#btnSubmit').prop('disabled', true).text('Đang gửi...');

        let code = document.getElementById('yourCode').value;
        let password = document.getElementById('yourPassword').value;
        let confirmPassword = document.getElementById('yourPasswordConfirm').value;

        let data = {
            code: code,
            email: localStorage.getItem('email'),
            username: "string",
            password: password,
            confirmPassword: confirmPassword
        }
        await authService.changePasswordForgot(data)
            .then((res) => {
                localStorage.clear();
                alert('Đổi mật khẩu tài khoản thành công! Vui lòng đăng nhập để tiếp tục...')
                window.location.href = '/login';
            })
            .catch((err) => {
                console.log(err.response.data);
                alert(`Thay đổi mật khẩu không thành công! ` + err.response.data.message);
                $('#btnSubmit').prop('disabled', false).text('Gửi');
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
                                                <h5 className="card-title text-center pb-0 fs-4">
                                                    Thay đổi mật khẩu trong tài khoản
                                                </h5>
                                                <p className="text-center small">
                                                    Nhập mã và mật khẩu mới để thay đổi
                                                </p>
                                            </div>

                                            <Form className="row g-3 needs-validation" onFinish={onFinish}>
                                                <div className="col-12">
                                                    <label htmlFor="yourCode" className="form-label">Mã xác minh</label>
                                                    <input type="text" name="yourCode" className="form-control"
                                                           id="yourCode" required/>
                                                    <div className="invalid-feedback">Vui lòng nhập mã xác minh.</div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="yourPassword"
                                                           className="form-label">Mật khẩu</label>
                                                    <input type="password" name="password" className="form-control"
                                                           id="yourPassword" required></input>
                                                    <div className="invalid-feedback">Vui lòng nhập mật khẩu của bạn!
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="yourPasswordConfirm" className="form-label">Xác nhận
                                                        mật khẩu</label>
                                                    <input type="password" name="password" className="form-control"
                                                           id="yourPasswordConfirm" required></input>
                                                    <div className="invalid-feedback">Vui lòng nhập mật khẩu xác nhận
                                                        của bạn!
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <button id="btnSubmit" className="btn btn-primary w-100"
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

export default ChangePassword
