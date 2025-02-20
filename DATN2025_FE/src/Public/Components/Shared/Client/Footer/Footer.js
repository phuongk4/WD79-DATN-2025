import React from 'react'
import {Link} from 'react-router-dom'

function Footer() {
    return (
        <footer className="site-footer border-top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="footer-heading mb-4">Thanh điều hướng nhanh</h3>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="/products">Cửa hàng</Link></li>
                                    <li><Link to="/about-us">Về chúng tôi</Link></li>
                                    <li><Link to="/contacts">Liên hệ chúng tôi</Link></li>
                                    <li><Link to="/coupons">Mã giảm giá</Link></li>
                                </ul>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="#">Trang web thương mại điện tử</Link></li>
                                    <li><Link to="#">Thời trang nam</Link></li>
                                    <li><Link to="#">Xu hướng thời trang nam</Link></li>
                                </ul>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="#">Khuyến mãi</Link></li>
                                    <li><Link to="#">Công nghệ</Link></li>
                                    <li><Link to="#">Danh mục</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
                        <h3 className="footer-heading mb-4">Khuyến mãi</h3>
                        <Link to="#" className="block-6">
                            <img src="/assets/clients/images/hero_1.jpg" alt="Image placeholder"
                                 className="img-fluid rounded mb-4"></img>
                            <h3 className="font-weight-light  mb-0">Khám phá thời trang nam đẳng cấp, phong cách và hiện
                                đại.</h3>
                            <p>Khuyến mãi từ ngày 15 tháng 9 năm 2024</p>
                        </Link>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="block-5 mb-5">
                            <h3 className="footer-heading mb-4">Thông tin liên lạc</h3>
                            <ul className="list-unstyled">
                                <li className="address">203 Fake St. Mountain View, San Francisco, California, USA</li>
                                <li className="phone"><a href="tel://23923929210">+2 392 3929 210</a></li>
                                <li className="email">emailaddress@domain.com</li>
                            </ul>
                        </div>

                        <div className="block-7">
                            <form action="#" method="post">
                                <label htmlFor="email_subscribe" className="footer-heading">Đặt mua</label>
                                <div className="form-group">
                                    <input type="text" className="form-control py-4" id="email_subscribe"
                                           placeholder="Email"></input>
                                    <input type="submit" className="btn btn-sm btn-primary" value="Send"></input>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row pt-5 mt-5 text-center">
                    <div className="col-md-12">
                        <p>
                            Bản quyền &copy;2024
                            Bảo lưu mọi quyền | Mẫu này được tạo bằng <i className="icon-heart"
                                                                         aria-hidden="true"></i> của <Link
                            to="#" target="_blank" className="text-primary">Nhóm phát triển thời trang nam</Link>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer
