import React from 'react';
import {Route, Routes} from 'react-router-dom';

/* Auth Page */
import Login from './Components/Account/Login/Login';
import Register from './Components/Account/Register/Register';
import ForgotPassword from "./Components/Account/ForgotPassword/ForgotPassword";
import ChangePassword from "./Components/Account/ForgotPassword/ChangePassword";

/* Main Page */
import Home from './Components/Home/Home';
import ProductList from './Components/Shop/ProductList/ProductList';
import ProductDetail from './Components/Shop/ProductDetail/ProductDetail';
import Cart from './Components/Cart/Cart';
/* Error Page */
import NotFound from "./Components/Shared/Error/Error404";
import ComingSoon from "./Components/Shared/ComingSoon/ComingSoon";

/* Admin Page */
import Dashboard from './Components/AdminApp/Dashboard/Dashboard';
/* Admin Category */
import ListCategory from './Components/AdminApp/Category/ListCategory/ListCategory';
import CreateCategory from './Components/AdminApp/Category/CreateCategory/CreateCategory';
import DetailCategory from './Components/AdminApp/Category/DetailCategory/DetailCategory';
import UpdateCategory from './Components/AdminApp/Category/UpdateCategory/UpdateCategory';
/* Admin Attribute */
import ListAttribute from './Components/AdminApp/Attribute/ListAttribute/ListAttribute';
import CreateAttribute from './Components/AdminApp/Attribute/CreateAttribute/CreateAttribute';
import DetailAttribute from './Components/AdminApp/Attribute/DetailAttribute/DetailAttribute';
/* Admin Property */
import ListProperty from './Components/AdminApp/Property/ListProperty/ListProperty';
import CreateProperty from './Components/AdminApp/Property/CreateProperty/CreateProperty';
import DetailProperty from './Components/AdminApp/Property/DetailProperty/DetailProperty';
/* Admin Product */
import ListProduct from './Components/AdminApp/Product/ListProduct/ListProduct';
import CreateProduct from './Components/AdminApp/Product/CreateProduct/CreateProduct';
import DetailProduct from './Components/AdminApp/Product/DetailProduct/DetailProduct';
import UpdateProduct from "./Components/AdminApp/Product/UpdateProduct/UpdateProduct";
/**
 * This component renders the routes for the public part of the application.
 * It includes the auth pages, the error pages, the client pages, the client auth pages, and the admin pages.
 * The admin pages are protected by authentication.
 * @returns {JSX.Element} The public routes.
 */
function Public() {
    return (
        <div>
            <Routes>
                {/* Auth Page */}
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path='/change-password' element={<ChangePassword/>}/>
                {/* Error Page */}
                <Route path='/not-found' element={<NotFound/>}/>
                <Route path='/coming-soon' element={<ComingSoon/>}/>
                {/* Client Page */}
                <Route path='/' element={<Home/>}/>
                <Route path='/products' element={<ProductList/>}/>
                <Route path='/products/:id' element={<ProductDetail/>}/>
                <Route path='/cart' element={<Cart/>}/>
                {/* Admin Page */}
                <Route path='/admin/dashboard' element={<Dashboard/>}/>
                {/* Admin Category */}
                <Route path='/admin/categories/list' element={<ListCategory/>}/>
                <Route path='/admin/categories/create' element={<CreateCategory/>}/>
                <Route path='/admin/categories/detail/:id' element={<DetailCategory/>}/>
                <Route path='/admin/categories/update/:id' element={<UpdateCategory/>}/>
                 {/* Admin Attributes */}
                 <Route path='/admin/attributes/list' element={<ListAttribute/>}/>
                <Route path='/admin/attributes/create' element={<CreateAttribute/>}/>
                <Route path='/admin/attributes/detail/:id' element={<DetailAttribute/>}/>
                {/* Admin Properties */}
                <Route path='/admin/properties/list' element={<ListProperty/>}/>
                <Route path='/admin/properties/create' element={<CreateProperty/>}/>
                <Route path='/admin/properties/detail/:id' element={<DetailProperty/>}/>
                {/* Admin Products */}
                <Route path='/admin/products/list' element={<ListProduct/>}/>
                <Route path='/admin/products/create' element={<CreateProduct/>}/>
                <Route path='/admin/products/detail/:id' element={<DetailProduct/>}/>
                <Route path='/admin/products/update/:id' element={<UpdateProduct/>}/>
            </Routes>
        </div>
    )
}

export default Public
