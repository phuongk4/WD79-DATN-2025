import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import accountService from "../Service/AccountService";
import {Form, message} from "antd";
import $ from "jquery";

function Profile() {
    const navigate = useNavigate();
    const email = sessionStorage.getItem("email")
    const Token = sessionStorage.getItem("accessToken")

    const [users, setUsers] = useState([]);

    const checkLogin = async () => {
        if (email == null || Token == null) {
            navigate('/login')
        }
    };

    const check_pass = async () => {
        if (document.getElementById('newPassword').value === document.getElementById('renewPassword').value) {
            document.getElementById('btnChangePass').disabled = false;
        } else {
            document.getElementById('btnChangePass').disabled = true;
        }
    }

    const getUser = async () => {
        await accountService.getInfo()
            .then((res) => {
                let user = JSON.parse(JSON.stringify(res.data.data));
                setUsers(user);
            })
            .catch((err) => {
                console.log(err)
                let stt = err.response.status;
                if (stt === 444) {
                    alert('Phiên đăng nhập đã hết hạn, đăng nhập lại...');
                    sessionStorage.clear();
                    navigate('/login');
                } else {
                    navigate('/login');
                }
            });
    };

    const updateInfo = async () => {
        $('#btnSave').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdateInfo input, #formUpdateInfo textarea, #formUpdateInfo select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
                return
            }
        }

        const formData = new FormData($('#formUpdateInfo')[0]);

        await accountService.updateAccount(formData)
            .then((res) => {
                console.log("update", res.data)
                alert("Thay đổi thông tin thành công!")
                getUser();
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
            })
            .catch((err) => {
                alert("Thay đổi thông tin thất bại! Vui lòng thử lại sau")
                console.log(err);
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
            })
    };

    function clickHandleImage() {
        var loadFile = function (event) {
            var output = document.getElementById('avtPreview');
            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function () {
                URL.revokeObjectURL(output.src)
            }
        };

        $('#avt').change(function (event) {
            loadFile(event);
        });
    }

    function showUpload() {
        $('#avt').trigger('click');
    }

    const changePass = async () => {
        const btnChangePass = $('#btnChangePass');
        btnChangePass.prop('disabled', true).text('Đang thay đổi...');

        let oldPassword = document.getElementById("currentPassword").value;
        let password = document.getElementById("newPassword").value;
        let confirmPassword = document.getElementById("renewPassword").value;

        if (!oldPassword) {
            alert("Vui lòng nhập mật khẩu hiện tại!");
            btnChangePass.prop('disabled', false).text('Lưu thay đổi');
            return;
        }

        if (!password) {
            alert("Vui lòng nhập mật khẩu mới!");
            btnChangePass.prop('disabled', false).text('Lưu thay đổi');
            return;
        }

        if (!confirmPassword) {
            alert("Vui lòng nhập mật khẩu xác nhận!");
            btnChangePass.prop('disabled', false).text('Lưu thay đổi');
            return;
        }

        let data = {
            password: oldPassword,
            newpassword: password,
            renewpassword: confirmPassword
        };

        try {
            const res = await accountService.changePassAccount(data);
            console.log("change pass: ", res.data);
            alert("Đổi mật khẩu thành công!");

            $('#currentPassword').val('');
            $('#newPassword').val('');
            $('#renewPassword').val('');

        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        } finally {
            btnChangePass.prop('disabled', false).text('Lưu thay đổi');
        }
    };

    useEffect(() => {
        clickHandleImage();
        checkLogin();
        getUser();
        check_pass();
    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Trang cá nhân</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item">Người dùng</li>
                            <li className="breadcrumb-item active">Trang cá nhân</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card">
                                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                    <img src={users.avt} alt="Profile" className="rounded-circle" width="100px"/>
                                    <h2>{users.full_name}</h2>
                                    <h3>{users.email}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8">
                            <div className="card">
                                <div className="card-body pt-3">
                                    <ul className="nav nav-tabs nav-tabs-bordered">
                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab"
                                                    data-bs-target="#profile-overview">Tổng quan
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab"
                                                    data-bs-target="#profile-edit">Chỉnh sửa trang cá nhân
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab"
                                                    data-bs-target="#profile-change-password">Đổi mật khẩu
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content pt-2">
                                        <div className="tab-pane fade show active profile-overview"
                                             id="profile-overview">
                                            <h5 className="card-title">Chi tiết</h5>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label ">Tên đầy đủ:</div>
                                                <div className="col-lg-9 col-md-8">{users.full_name}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Địa chỉ</div>
                                                <div className="col-lg-9 col-md-8">{users.address}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Số điện thoại</div>
                                                <div className="col-lg-9 col-md-8">{users.phone}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Email</div>
                                                <div className="col-lg-9 col-md-8">{users.email}</div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                                            {/* Profile Edit Form */}
                                            <Form className="form-update-info" id="formUpdateInfo"
                                                  onFinish={updateInfo}>
                                                <div className="row mb-3">
                                                    <label htmlFor="profileImage"
                                                           className="col-md-4 col-lg-3 col-form-label">Ảnh đại
                                                        diện: </label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <img style={{borderRadius: "50%"}} src={users.avt}
                                                             alt="Profile" width="100px" id="avtPreview"/>
                                                        <div className="pt-2">
                                                            <button type="button" onClick={showUpload} id="btnUploadAvt"
                                                                    className="btn btn-primary btn-sm">
                                                                <label className="upload position-relative">
                                                                    <p className="mb-0">
                                                                        <i className="bi bi-cloud-arrow-up text-white fs-6"></i>
                                                                    </p>
                                                                </label>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3 d-none">
                                                    <label htmlFor="avt"
                                                           className="col-md-4 col-lg-3 col-form-label">Ảnh đại
                                                        diện: </label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="avatar" type="file" className="form-control"
                                                               id="avt"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="full_name"
                                                           className="col-md-4 col-lg-3 col-form-label">Tên đầy
                                                        đủ: </label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="full_name" type="text" className="form-control"
                                                               id="full_name" defaultValue={users.full_name}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="address"
                                                           className="col-md-4 col-lg-3 col-form-label">Đia chỉ</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="address" type="text" className="form-control"
                                                               id="address" defaultValue={users.address}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="phone"
                                                           className="col-md-4 col-lg-3 col-form-label">Số điện
                                                        thoại</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="phone" type="text" className="form-control"
                                                               id="phone" defaultValue={users.phone}/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="email"
                                                           className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="email" type="email" className="form-control"
                                                               id="email" defaultValue={users.email}/>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <button type="submit" id="btnSave" className="btn btn-primary">
                                                        Lưu thay đổi
                                                    </button>
                                                </div>
                                            </Form>{/* End Profile Edit Form */}
                                        </div>
                                        <div className="tab-pane fade pt-3" id="profile-change-password">
                                            {/* Change Password Form */}
                                            <Form className="form-change-password" id="formChangePassword"
                                                  onFinish={changePass}>
                                                <div className="row mb-3">
                                                    <label htmlFor="currentPassword"
                                                           className="col-md-4 col-lg-3 col-form-label">Mật khẩu hiện
                                                        tại</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="password" type="password" className="form-control"
                                                               id="currentPassword"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="newPassword"
                                                           className="col-md-4 col-lg-3 col-form-label">Mật khẩu
                                                        mới</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="newpassword" type="password" onKeyUp={check_pass}
                                                               className="form-control" id="newPassword"/>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="renewPassword"
                                                           className="col-md-4 col-lg-3 col-form-label">Xác nhận mật
                                                        khẩu mới</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="renewpassword" type="password" onKeyUp={check_pass}
                                                               className="form-control" id="renewPassword"/>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <button id="btnChangePass" type="submit"
                                                            className="btn btn-primary">Lưu thay đổi
                                                    </button>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>

    )
}

export default Profile