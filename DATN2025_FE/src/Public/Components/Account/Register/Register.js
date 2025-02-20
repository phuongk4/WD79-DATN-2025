import React from 'react';
import {Link} from 'react-router-dom';
import authService from '../../Service/AuthService';
import $ from "jquery";
import {Button, Form, Input, message} from 'antd';
import Css from "../../Shared/Admin/Lib/StyleSheet";
import Script from "../../Shared/Admin/Lib/Script";

function Register() {
    function checkPhone() {
        $('.message_error').addClass('d-none');
        let val = $('#phone').val()
        if (!$.isNumeric(val)) {
            val = val.replace(/\D/g, '');
            $('#phone').val(val);
        }
    }

    function isVietnamesePhoneNumber(number) {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    const onFinish = async () => {
        $('.needs-validation').addClass('was-validated');
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let password = document.getElementById('password').value;
        let password_confirm = document.getElementById('password_confirm').value;

        $('#btnRegister').prop('disabled', true).text('Đang đăng ký...');

        let check = isVietnamesePhoneNumber(phone);
        if (!check) {
            // alert('Số điện thoại phải điền đúng định dạng')
            $('.message_error').removeClass('d-none');
            $('#btnRegister').prop('disabled', false).text('Đăng ký');
            return;
        }

        let data = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            password_confirm: password_confirm,
        }
        await authService.registerAccount(data)
            .then((res) => {
                alert(`Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục...`);
                window.location.href = '/login';
            })
            .catch((err) => {
                console.log(err.response.data);
                alert(`Đăng ký thất bại! ` + err.response.data.message);
                $('#btnRegister').prop('disabled', false).text('Đăng ký');
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
                                                <h5 className="card-title text-center pb-0 fs-4">Tạo một tài khoản</h5>
                                                <p className="text-center small">Nhập thông tin cá nhân của bạn để tạo
                                                    tài khoản</p>
                                            </div>

                                            <Form className="row g-3 needs-validation" onFinish={onFinish}>
                                                <div className="col-12">
                                                    <label htmlFor="name" className="form-label">Tên</label>
                                                    <input type="text" name="name" className="form-control"
                                                           id="name" required/>
                                                    <div className="invalid-feedback">Vui lòng chọn tên.</div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="email" className="form-label">Email của
                                                        bạn</label>
                                                    <input type="email" name="email" className="form-control"
                                                           id="email"
                                                           required></input>
                                                    <div className="invalid-feedback">Vui lòng nhập địa chỉ Email hợp
                                                        lệ!
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                                    <input type="text" name="phone" className="form-control"
                                                           onInput={checkPhone}
                                                           id="phone" required/>
                                                    <div className="invalid-feedback">Vui lòng chọn số điện thoại.</div>
                                                    <div className="message_error text-danger d-none">Vui lòng nhập số điện thoại hợp lệ.</div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                                    <input type="password" name="password" className="form-control"
                                                           id="password" required></input>
                                                    <div className="invalid-feedback">Vui lòng nhập mật khẩu!</div>
                                                </div>

                                                <div className="col-12">
                                                    <label htmlFor="password_confirm" className="form-label">
                                                        Xác nhận mật khẩu
                                                    </label>
                                                    <input type="password" name="password_confirm"
                                                           className="form-control"
                                                           id="password_confirm" required></input>
                                                    <div className="invalid-feedback">Vui lòng nhập mật khẩu xác nhận!
                                                    </div>
                                                </div>

                                                {/*<div className="col-12">*/}
                                                {/*    <div className="form-check">*/}
                                                {/*        <input className="form-check-input" name="terms" type="checkbox"*/}
                                                {/*               value="" id="acceptTerms" required></input>*/}
                                                {/*        <label className="form-check-label" htmlFor="acceptTerms">*/}
                                                {/*            Tôi đồng ý và chấp nhận <Link to="#">các điều khoản và điều*/}
                                                {/*            kiện</Link>*/}
                                                {/*        </label>*/}
                                                {/*        <div className="invalid-feedback">*/}
                                                {/*            Bạn phải đồng ý trước khi gửi.*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}

                                                <div className="col-12">
                                                    <button id="btnRegister" className="btn btn-primary w-100"
                                                            type="submit">Đăng ký
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

export default Register
