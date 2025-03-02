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
function UpdateProduct() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [categories, setData] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);

    let isFeature = false;
    let isHot = false;

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

    /**
     * Fetches the list of properties from the server and updates the component state
     * accordingly.
     *
     * This function is called when the component mounts and when the user navigates to a
     * different page. It calls the API to fetch the list of properties, and if the call is
     * successful, it updates the component state with the new data and sets the loading
     * state to false. If the call fails, it sets the loading state to false and logs the
     * error to the console.
     *
     * @async
     * @function
     * @returns {Promise<void>} A Promise that resolves when the data has been fetched and
     * the component state has been updated.
     */
    async function getListProperty(attribute_id, el) {
        await propertyService.listPropertyByAttribute(attribute_id)
            .then((res) => {
                if (res.status === 200) {
                    let data = res.data.data;
                    setProperties(data);
                    renderProperty(el, data);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function renderProperty(el, data) {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<option value="${data[i].id}">${data[i].name}</option>`;
        }
        $(el).parent().next().find('select[name="property_item"]').html(html);
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

    const onFinish = async () => {
        setLoading(true)
        $('#btnSave').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdate input, #formUpdate textarea, #formUpdate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
                setLoading(false);
                return;
            }
        }

        if ($('#isFeature').is(":checked")) {
            isFeature = true;
        }

        if ($('#isHot').is(":checked")) {
            isHot = true;
        }

        const formData = new FormData($('#formUpdate')[0]);

        // if (editorRef.current) {
        //     const content = editorRef.current.getContent();
        //     if (!content) {
        //         alert('Mô tả sản phẩm không được bỏ trống!');
        //         $('#btnCreate').prop('disabled', false).text('Tạo mới');
        //         setLoading(false);
        //         return;
        //     }
        //
        //     formData.append('description', content);
        // } else {
        //     formData.append('description', $('#description').val() ?? '');
        // }

        const shortDescriptionContent = shortDescriptionRef.current.getContent();
        const descriptionContent = descriptionRef.current.getContent();

        if (!shortDescriptionContent) {
            alert('Mô tả ngắn không được bỏ trống!');
            setLoading(false);
            return;
        }
        if (!descriptionContent) {
            alert('Mô tả không được bỏ trống!');
            setLoading(false);
            return;
        }

        formData.append('short_description', shortDescriptionContent);
        formData.append('description', descriptionContent);


        formData.append('is_feature', isFeature);
        formData.append('is_hot', isHot);

        let filedata = document.getElementById("gallery");
        let i = 0, len = filedata.files.length, img, reader, file;

        if (len > 0) {
            for (i; i < len; i++) {
                file = filedata.files[i];
                formData.append('gallery[]', file);
            }
        }

        const photo = $('#thumbnail')[0].files[0];
        formData.append('thumbnail', photo);

        let _table_attr = $('#render_table_attr').find('tbody');

        let data_options = [];
        let data_images = [];
        _table_attr.each(function () {
            let _this = $(this);
            let list_option = _this.find('.list_option');

            let item = [];
            list_option.find('.attribute_property_item_').each(function () {
                let el = $(this);
                let attribute_item = el.find('select[name="attribute_item"]').val();
                let property_item = el.find('select[name="property_item"]').val();

                let _child = {
                    attribute_item: attribute_item,
                    property_item: property_item
                }
                item.push(_child)
            })

            let option_quantity = _this.find('input[name="option_quantity"]').val();
            let option_price = _this.find('input[name="option_price"]').val();
            let option_sale_price = _this.find('input[name="option_sale_price"]').val();
            let option_description = _this.find('textarea[name="option_description"]').val() ?? '';
            let option_thumbnail_uploaded = _this.find('input[name="option_thumbnail_uploaded"]').val();

            let _data = {
                _options: item,
                quantity: option_quantity,
                price: option_price,
                sale_price: option_sale_price,
                description: option_description,
                thumbnail_uploaded: option_thumbnail_uploaded,
            }
            data_options.push(_data)
        })

        formData.append('data_options', JSON.stringify(data_options));

        let fileDataOption = document.getElementsByName("option_thumbnail");
        let j = 0, length, imgOp, readerOp, fileOp;

        for (let i = 0; i < fileDataOption.length; i++) {
            let inputFile = fileDataOption[i];

            if (inputFile.files.length > 0) {
                length = inputFile.files.length;
                for (j = 0; j < length; j++) {
                    fileOp = inputFile.files[j];
                    formData.append('data_images[]', fileOp);
                }
            } else {
                formData.append('data_images[]', '')
            }
        }

        await productService.adminUpdateProduct(id, formData)
            .then((res) => {
                setLoading(false)
                message.success("Thay đổi thành công")
                navigate("/admin/products/list")
            })
            .catch((err) => {
                setLoading(false);
                console.log(err)
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
            })
    };

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
            <select name="attribute_item" class="form-select form_input_" onchange="getPropertyByAttribute(this)">
                ${attributes_option.map((attribute) =>
                    `<option value="${attribute.id}" ${attribute.id === el.attribute_item.id ? 'selected' : ''}>${attribute.name}</option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group col-md-5">
            <label for="property_item">Giá trị thuộc tính</label>
            <select name="property_item" class="form-select form_input_" data-sl="">
                <option value="${el.property_item.id}">${el.property_item.name}</option>
            </select>
        </div>
        <div class="col-md-2 mt-4">
            <button type="button" onclick="removePropertyItem(this)" class="btn btn-danger">Xoá</button>
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
            <col width="5%"/>
        </colgroup>
        <thead>
            <tr>
                <th class="align-middle">
                    <div class="d-flex align-items-center gap-4">
                        <p>Thuộc tính</p>
                        <button type="button" class="btn btn-outline-warning btnAddProperty" onclick="addProperty(this)">Thêm</button>
                    </div>
                </th>
                <th>Số lượng</th>
                <th>Giá cũ</th>
                <th>Giá mới</th>
                <th class="d-none">Hình ảnh</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="list_option">` + sup_html_ + `</div>
                </td>
                <td>
                    <input type="number" min="1" class="form-control form_input_" name="option_quantity" value="${_this.quantity}" required/>
                </td>
                <td>
                    <input type="number" class="form-control form_input_" name="option_price" value="${_this.price}" min="1" required/>
                </td>
                <td>
                    <input type="number" class="form-control form_input_" name="option_sale_price" value="${_this.sale_price}" min="1" required/>
                </td>
                <td class="d-none">
                    <input type="file" class="form-control" name="option_thumbnail" />
                    <img src="${_this.thumbnail}" alt="" class="mt-3" width="200px">
                    <input type="text" class="d-none" name="option_thumbnail_uploaded" value="${_this.thumbnail}">
                </td>
                <td rowSpan="3" class="text-center align-middle">
                    <button class="btn btn-danger btnDelete" onclick="removeTableOption(this)" type="button">Xoá</button>
                </td>
            </tr>
        </tbody>
    </table>`;
        }

        $('#render_table_attr').empty().append(html);
    }

    const generateTable = () => `
    <table class="table table-bordered">
        <colgroup>
            <col width="x"/>
            <col width="8%"/>
            <col width="10%"/>
            <col width="10%"/>
<!--            <col width="8%"/>-->
            <col width="5%"/>
        </colgroup>
        <thead>
            <tr>
                <th class="align-middle">
                    <div class="d-flex align-items-center gap-4">
                        <p>Thuộc tính</p>
                        <button type="button" class="btn btn-outline-warning btnAddProperty" onclick="addProperty(this)">Thêm</button>
                    </div>
                </th>
                <th>Số lượng</th>
                <th>Giá cũ</th>
                <th>Giá mới</th>
               <th class="d-none">Hình ảnh</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="list_option">
                    
                    </div>
                </td>
                <td>
                    <input type="number" min="1" class="form-control form_input_" name="option_quantity" required/>
                </td>
                <td>
                    <input type="number" class="form-control form_input_" name="option_price" min="1" required/>
                </td>
                <td>
                    <input type="number" class="form-control form_input_" name="option_sale_price" min="1" required/>
                </td>
                <td class="d-none">
                    <input type="file" class="form-control form_input_" name="option_thumbnail"/>
                    <input type="text" class="d-none" name="option_thumbnail_uploaded" value="no_image">
                </td>
                <td rowSpan="3" class="text-center align-middle">
                    <button class="btn btn-danger btnDelete" onclick="removeTableOption(this)" type="button">Xoá</button>
                </td>
            </tr>
        </tbody>
    </table>`;

    const generatePropertyItem = (array_attr) => `
    <div class="row attribute_property_item_">
        <div class="form-group col-md-5">
            <label for="attribute_item">Thuộc tính</label>
            <select name="attribute_item" class="form-select form_input_" onchange="getPropertyByAttribute(this)">
                <option value="">-- Chọn thuộc tính --</option>
                ${attributes
        .filter((attribute) => !array_attr.includes(attribute.id))
        .map((attribute) => `<option value="${attribute.id}">${attribute.name}</option>`)
        .join('')}
            </select>
        </div>
        <div class="form-group col-md-5">
            <label for="property_item">Giá trị thuộc tính</label>
            <select name="property_item" class="form-select form_input_">
                <option value="">-- Chọn giá trị thuộc tính --</option>
            </select>
        </div>
        <div class="col-md-2 mt-4">
            <button type="button" onclick="removePropertyItem(this)" class="btn btn-danger">Xoá</button>
        </div>
    </div>`;

    function addTableOption() {
        $('#render_table_attr').append(generateTable());
    }

    window.addProperty = function (el) {
        let array_attr = [];
        $(el).closest('table').find('.list_option .attribute_property_item_').each(function () {
            let attr = $(this).find('select[name="attribute_item"]').val();
            attr = parseInt(attr);
            array_attr.push(attr)
        })

        array_attr = array_attr.filter(onlyUnique);

        $(el).closest('table').find('.list_option').append(generatePropertyItem(array_attr));
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    window.removeTableOption = function (el) {
        $(el).closest('table').remove();
    };

    window.removePropertyItem = function (el) {
        $(el).closest('.attribute_property_item_').remove();
    };

    window.getPropertyByAttribute = function (el) {
        let attr = $(el).val();
        getListProperty(attr, el);
    };


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
                    <h1>Chỉnh sửa sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Chỉnh sửa sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa sản phẩm</h5>
                                    <Form onFinish={onFinish} id="formUpdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên sản phẩm</label>
                                            <input type="text" className="form-control form_input_" id="name"
                                                   name="name"
                                                   defaultValue={product.name} required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="price">Giá cũ</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="price"
                                                       defaultValue={product.price} name="price" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="sale_price">Giá mới</label>
                                                <input type="number" className="form-control form_input_"
                                                       id="sale_price" min="1"
                                                       name="sale_price" defaultValue={product.sale_price}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="quantity">Số lượng</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="quantity"
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
                                                initialValue={product.description}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh</label>
                                                <input type="file" className="form-control" id="thumbnail"
                                                       name="thumbnail"/>
                                                <img className="mt-3" width="200px" src={`http://127.0.0.1:8000${product.thumbnail}`} alt={product.name} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh chi tiết</label>
                                                <input type="file" className="form-control" id="gallery" name="gallery"
                                                       multiple/>

                                                <div id="list_images" className="d-flex align-items-center gap-2">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="category_id">Danh mục</label>
                                                <select id="category_id" className="form-control form_input_"
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
                                                <select id="status" className="form-control form_input_" name="status">
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

                                                <button className="btn btn-outline-primary btnAddAttribute"
                                                        type="button" onClick={addTableOption}>Thêm giá trị thuộc tính
                                                </button>
                                            </div>
                                            <div id="render_table_attr" className="">

                                            </div>
                                        </div>
                                        <button type="submit" id="btnSave" className="btn btn-primary mt-3">
                                            Lưu thay đổi
                                        </button>
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

export default UpdateProduct