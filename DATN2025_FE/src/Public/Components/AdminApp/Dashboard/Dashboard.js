import React, {useEffect} from 'react'
import Header from '../../Shared/Admin/Header/Header';
import Sidebar from '../../Shared/Admin/Sidebar/Sidebar';
import Footer from '../../Shared/Admin/Footer/Footer';

function Dashboard() {
    useEffect(() => {

    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main" style={{backgroundColor: "#f6f9ff"}}>
                <div className="pagetitle">
                    <h1>Trang quản trị</h1>
                </div>
                <section className="section dashboard">

                </section>
            </main>
            <Footer/>
        </>
    )
}

export default Dashboard;
