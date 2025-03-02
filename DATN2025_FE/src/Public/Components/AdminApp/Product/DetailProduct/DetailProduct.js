import {Form, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import productService from '../../../Service/ProductService';
import categoryService from '../../../Service/CategoryService';
import attributeService from '../../../Service/AttributeService';
import propertyService from '../../../Service/PropertyService';
import $ from "jquery";
import {API_KEY_TINYMCE} from "../../../config/Constants";
import {Editor} from "@tinymce/tinymce-react";

/**
 * Renders a page that displays the details of a product.
 * The page provides a form for editing the product.
 * The form includes fields for the product name, price, quantity, description, image, category, and status.
 * The page uses the `productService` to fetch the details of the product from the server.
 * The page also uses the `categoryService` to fetch the list of categories from the server.
 * The page uses the `useState` hook to store the list of categories and the table parameters in the component state.
 * The page uses the `useCallback` hook to memoize the function that fetches the list of categories.
 * The page uses the `useCallback` hook to memoize the function that handles the change event of the table.
 * The page uses the `useEffect` hook to fetch the list of categories when the component mounts.
 * The page uses the `useEffect` hook to fetch the details of the product when the component mounts.
 * The page also uses the `useEffect` hook to update the component state when the user navigates to a different product.
 * @returns {ReactElement} A React element that represents the page.
 * @function
 */
function DetailProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState([]);
    const [categories, setData] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);

    const getProduct = async () => {
        await productService.adminDetailProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.data)
                    setLoading(false)
                    renderImage(res.data.data.gallery, res.data.data.name)
                    renderOptions(res.data.data.options);

                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const getListCategory = async () => {
        await categoryService.adminListCategory()
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    /**
     * Fetches the list of attributes from the server and updates the component state
     * accordingly.
     * @function
     * @async
     * @returns {Promise<void>} A Promise that resolves when the data has been fetched and
     * the component state has been updated.
     */
    const getListAttribute = async () => {
        await attributeService.adminListAttribute()
            .then((res) => {
                if (res.status === 200) {
                    setAttributes(res.data.data)
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    function renderImage(images, alt) {
        let arr = images.split(',');
        let html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="item">
          <img width="200px" src="http://127.0.0.1:8000${arr[i]}" alt="${alt}">
        </div>`;
        }

        $('#list_images').empty().append(html);
    }

    async function renderOptions(options) {
        let html = ``;

        let attributes_option = null
        await attributeService.adminListAttribute()
            .then((res) => {
                if (res.status === 200) {
                    attributes_option = res.data.data
                }
            })
            .catch((err) => {
                console.log(err)
            })


        for (let i = 0; i < options.length; i++) {
            let _this = options[i];

            let sup_html_ = '';

            let options_items = _this.options;

            for (let j = 0; j < options_items.length; j++) {
                let el = options_items[j];

                sup_html_ += `  <div class="row attribute_property_item_">
        <div class="form-group col-md-5">
            <label for="attribute_item">Thuộc tính</label>
            <select name="attribute_item" disabled class="form-select form_input_" onchange="getPropertyByAttribute(this)">
                ${attributes_option.map((attribute) =>
                    `<option value="${attribute.id}" ${attribute.id === el.attribute_item.id ? 'selected' : ''}>${attribute.name}</option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group col-md-5">
            <label for="property_item">Giá trị thuộc tính</label>
            <select name="property_item" disabled class="form-select form_input_" data-sl="">
                <option value="${el.property_item.id}">${el.property_item.name}</option>
            </select>
        </div>
      
    </div>`;
            }

            html += `<table class="table table-bordered">
        <colgroup>
            <col width="x"/>
            <col width="8%"/>
            <col width="10%"/>
            <col width="10%"/>
<!--            <col width="8%"/>-->
<!--            <col width="5%"/>-->
        </colgroup>
        <thead>
            <tr>
                <th class="align-middle">
                    <div class="d-flex align-items-center gap-4">
                        <p>Thuộc tính</p>
                    </div>
                </th>
                <th>Số lượng</th>
                <th>Giá cũ</th>
                <th>Giá mới</th>
                <th class="d-none">Hình ảnh</th>
                <th class="d-none"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="list_option">` + sup_html_ + `</div>
                </td>
                <td>
                    <input type="number" disabled min="1" class="form-control form_input_" name="option_quantity" value="${_this.quantity}" required/>
                </td>
                <td>
                    <input type="number" disabled class="form-control form_input_" name="option_price" value="${_this.price}" min="1"/>
                </td>
                <td>
                    <input type="number" disabled class="form-control form_input_" name="option_sale_price" value="${_this.sale_price}" min="1"/>
                </td>
                <td class="d-none">
                    <input type="file" class="form-control" name="option_thumbnail" />
                    <img src="${_this.thumbnail}" alt="" class="mt-3" width="200px">
                    <input type="text" class="d-none" name="option_thumbnail_uploaded" value="${_this.thumbnail}">
                </td>
                <td rowSpan="3" class="text-center align-middle d-none">
                    <button class="btn btn-danger btnDelete" onclick="removeTableOption(this)" type="button">Xoá</button>
                </td>
            </tr>
        </tbody>
    </table>`;
        }

        $('#render_table_attr').empty().append(html);
    }


    useEffect(() => {
        getListCategory();
        getListAttribute();
        getProduct();
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chi tiết sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Chi tiết sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chi tiết sản phẩm</h5>
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="name">Tên sản phẩm</label>
                                            <input type="text" className="form-control form_input_" id="name"
                                                   name="name" disabled
                                                   defaultValue={product.name} required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="price">Giá cũ</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="price" disabled
                                                       defaultValue={product.price} name="price" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="sale_price">Giá mới</label>
                                                <input type="number" className="form-control form_input_"
                                                       id="sale_price" min="1" disabled
                                                       name="sale_price" defaultValue={product.sale_price}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="quantity">Số lượng</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="quantity" disabled
                                                       name="quantity" defaultValue={product.quantity}
                                                       required/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="short_description">Mô tả ngắn</label>
                                            {/*<textarea className="form-control tinymce-editor form_input_" name="short_description"*/}
                                            {/*          id="short_description" defaultValue={product.short_description}*/}
                                            {/*          rows="10"></textarea>*/}
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                                init={{
                                                    plugins: [
                                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                                    ],
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    tinycomments_mode: 'embedded',
                                                    tinycomments_author: 'Author name',
                                                    /**
                                                     * The AI request function. This function is called when the AI button in the toolbar is clicked.
                                                     * It should return a promise that resolves with a string containing the AI response.
                                                     * The string should be a valid HTML string.
                                                     * The function takes two parameters, `request` and `respondWith`. `request` is an object containing information about the request,
                                                     * and `respondWith` is a function that should be called with the response string.
                                                     * The `respondWith` function takes one parameter, a string containing the response.
                                                     * The `respondWith` function should be called with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The function should return a promise.
                                                     * The promise should resolve with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The AI request function should be a function.
                                                     * @param {object} request - The request object.
                                                     * @param {function} respondWith - The respondWith function.
                                                     * @returns {Promise<string>} - A promise that resolves with a string containing the AI response.
                                                     */
                                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                                }}
                                                id="short_description"
                                                name="short_description"
                                                disabled={true}
                                                initialValue={product.short_description}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả</label>
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => descriptionRef.current = editor}
                                                init={{
                                                    plugins: [
                                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                                    ],
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    tinycomments_mode: 'embedded',
                                                    tinycomments_author: 'Author name',
                                                    /**
                                                     * The AI request function. This function is called when the AI button in the toolbar is clicked.
                                                     * It should return a promise that resolves with a string containing the AI response.
                                                     * The string should be a valid HTML string.
                                                     * The function takes two parameters, `request` and `respondWith`. `request` is an object containing information about the request,
                                                     * and `respondWith` is a function that should be called with the response string.
                                                     * The `respondWith` function takes one parameter, a string containing the response.
                                                     * The `respondWith` function should be called with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The function should return a promise.
                                                     * The promise should resolve with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The AI request function should be a function.
                                                     * @param {object} request - The request object.
                                                     * @param {function} respondWith - The respondWith function.
                                                     * @returns {Promise<string>} - A promise that resolves with a string containing the AI response.
                                                     */
                                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                                }}
                                                id="description"
                                                name="description"
                                                disabled={true}
                                                initialValue={product.description}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh</label>

                                                <img className="mt-3" width="200px" src={`http://127.0.0.1:8000${product.thumbnail}`} alt={product.name} />

                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh chi tiết</label>

                                                <div id="list_images" className="d-flex align-items-center gap-2">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="category_id">Danh mục</label>
                                                <select id="category_id" disabled className="form-control form_input_"
                                                        name="category_id">
                                                    <option value="">Chọn danh mục</option>
                                                    {
                                                        categories.map((category) => (
                                                            <option selected={category.id === product.category_id}
                                                                    value={category.id}>{category.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select id="status" disabled className="form-control form_input_" name="status">
                                                    <option value="ĐANG HOẠT ĐỘNG">ĐANG HOẠT ĐỘNG</option>
                                                    <option value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <label>
                                                    Thông tin sản phẩm
                                                </label>
                                            </div>
                                            <div id="render_table_attr" className="">

                                            </div>
                                        </div>
                                        <a href={'/admin/products/update/' + id} className="btn btn-primary mt-3">
                                            Chỉnh sửa
                                        </a>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default DetailProduct