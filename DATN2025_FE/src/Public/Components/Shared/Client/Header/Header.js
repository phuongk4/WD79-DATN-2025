import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import accountService from "../../../Service/AccountService";
import Css from "../../Client/Lib/StyleSheet";
import Script from "../../Client/Lib/Script";
import $ from "jquery";
import cartService from "../../../Service/CartService";
import categoryService from "../../../Service/CategoryService";

function NoLogin() {
    return (
        <div className="site-top-icons">
            <ul>
                <li><Link to="/login"><i className="fa-solid fa-right-to-bracket"></i></Link></li>
                <li className="d-inline-block d-md-none ml-md-0">
                    <Link to="#" className="site-menu-toggle js-menu-toggle"><span
                        className="icon-menu"></span></Link></li>
            </ul>
        </div>
    );
}

function YesLogin() {
    const userId = sessionStorage.getItem("id")
    const [loading, setLoading] = useState(true);

    const handlelogout = () => {
        sessionStorage.clear();
        alert('Đăng xuất thành công!');
        window.location.href = '/';
    }

    const getListCart = async () => {
        await cartService.listCart()
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false)
                    let count = res.data.data.length;
                    console.log(count);
                    $('#countCart').text(count);
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        getListCart();
    }, [loading]);

    return (
        <div className="site-top-icons">
            <ul>
                <li><Link to="/profile"><span className="icon icon-person"></span></Link></li>
                <li><Link to="/product-favourites"><span className="icon icon-heart-o"></span></Link></li>
                <li>
                    <Link to="/cart" className="site-cart">
                        <span className="icon icon-shopping_cart"></span>
                        <span className="count" id="countCart">0</span>
                    </Link>
                </li>
                <li><Link to="#" onClick={handlelogout}><i className="fa-solid fa-right-to-bracket"></i></Link></li>
                <li className="d-inline-block d-md-none ml-md-0">
                    <Link to="#"
                          className="site-menu-toggle js-menu-toggle"><span
                        className="icon-menu"></span></Link></li>
            </ul>
        </div>
    );
}

function HeaderClient() {
    const [searchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    let isLogin = true;

    const Auth = sessionStorage.getItem("accessToken")
    const Email = sessionStorage.getItem("email")

    if (Email == null || Auth == null) {
        isLogin = false;
    }

    const handleClick = (event) => {
        event.preventDefault();
        const categoryId = event.currentTarget.getAttribute('data-id');
        searchMainProduct(categoryId);
    };

    let category_param = searchParams.get('category');
    let keyword_param = searchParams.get('keyword');
    let size_param = searchParams.get('size');
    let sort_param = searchParams.get('sort');
    let minPrice_param = searchParams.get('minPrice');
    let maxPrice_param = searchParams.get('maxPrice');
    let option_param = searchParams.get('option');

    $('#min-price').val(minPrice_param)
    $('#max-price').val(maxPrice_param)

    const getListCategory = async () => {
        await categoryService.listCategory()
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data.data);
                } else {
                    alert('Error')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /**
     * This function is used to search for products by keyword, category, and other criteria.
     * It constructs a URL with query parameters based on the values of the search form,
     * and then navigates to that URL.
     * @param {string} [categoryID] - The ID of the category to search in. If not provided,
     * the value of the 'category' parameter in the URL will be used instead.
     */
    function searchMainProduct(categoryID) {
        let baseurl = '/products/search';
        let category = category_param ?? categoryID;
        let keyword = $('#keywordSearch').val();
        let size = size_param ?? '';
        let sort = sort_param ?? 'desc';
        let minPrice = $('#min-price').val() ?? '';
        let maxPrice = $('#max-price').val() ?? '';
        let optionVal = option_param ?? '';

        let searchUrl = `${baseurl}?keyword=${keyword}&size=${size}&category=${category}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&option=${optionVal}`;
        console.log(searchUrl);
        window.location.href = searchUrl;
    }

    const processSearch = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMainProduct('');
        }
    };

    useEffect(() => {
        getListCategory();
    }, []);

    return (
        <>
            <Css/>
            <Script/>
            <header className="site-navbar" role="banner">
                <div className="site-navbar-top">
                    <div className="container">
                        <div className="row align-items-center">

                            <div className="col-6 col-md-4 order-2 order-md-1 site-search-icon text-left">
                                <form action="#" className="site-block-top-search">
                                    <span className="icon icon-search2"></span>
                                    <input type="text" className="form-control border-0" id="keywordSearch"
                                           onKeyDown={processSearch} defaultValue={keyword_param}
                                           placeholder="Nhập từ khóa tìm kiếm"></input>
                                </form>
                            </div>

                            <div className="col-12 mb-3 mb-md-0 col-md-4 order-1 order-md-2 text-center">
                                <div className="site-logo">
                                    <a href="/" className="js-logo-clone">SOLEVIBE</a>
                                </div>
                            </div>

                            <div className="col-6 col-md-4 order-3 order-md-3 text-right">
                                {isLogin ? <YesLogin/> : <NoLogin/>}
                            </div>

                        </div>
                    </div>
                </div>
                <nav className="site-navigation text-right text-md-center" role="navigation">
                    <div className="container">
                        <ul className="site-menu js-clone-nav d-none d-md-block">
                            <li><a href="/" className="active">Trang chủ</a></li>
                            <li className="has-children">
                                <a href="/products">Danh mục</a>
                                <ul className="dropdown">
                                    {
                                        categories.map((category) => (
                                            <li className="mb-1" key={category.id}>
                                                <a href={'/products?category=' + category.id} data-id={category.id}
                                                   className="d-flex categoryID" onClick={handleClick}>
                                                    <span>{category.name}</span>
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                            <li className="has-children">
                                <a href="#">Mục lục</a>
                                <ul className="dropdown">
                                    <li><a href="/products">Cửa hàng</a></li>
                                    <li><a href="/coupons">Mã giảm giá</a></li>
                                    <li><a href="/about-us">Về chúng tôi</a></li>
                                    <li><a href="/contact">Liên hệ</a></li>
                                </ul>
                            </li>
                            <li><a href="/products">Cửa hàng</a></li>
                            <li><a href="/about-us">Về chúng tôi</a></li>
                            <li><a href="/contact">Liên hệ</a></li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default HeaderClient