import React, { useState, useEffect } from "react";
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Home from "./layouts/Home";
import { Link } from "react-router-dom";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import Pagination from "./layouts/Pagination";

const Dashboard = ({ setAuth }) => {
    const [identity, setIdentity] = useState({});
    const [plans, setPlan] = useState([]);
    const [services, setServices] = useState([]);
    const activeSidebar = "Tất cả sản phẩm";
    const [home, setHome] = useState();
    const [filteredDatabases, setFilteredDatabases] = useState([]);

    // ***********pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;

    const getIdentity = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            )
            const parseRes = await response.json();
            setIdentity(parseRes);
        } catch (error) {
            console.error(error.message);
        }
    }

    const getPlan = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/home`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            )
            const parseRes = await response.json();
            if (Array.isArray(parseRes)) {
                setPlan([...parseRes]);
                setFilteredDatabases([...parseRes]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getServices = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/services`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            )
            const parseRes = await response.json();
            if (Array.isArray(parseRes)) {
                setServices([...parseRes]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    };

    useEffect(() => {
        getIdentity();
        getPlan();
        getServices();
    }, []);

    /// filter month
    const handleMonthChange = (e) => {
        const selectedMonth = e.target.value;
        if (selectedMonth) {
            const formattedMonth = new Date(selectedMonth)
                .toLocaleDateString("en-US", { year: 'numeric', month: '2-digit' });

            const filteredDatabases = plans.filter(db => {
                const dbMonth = new Date(db.thang).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit' });
                return dbMonth === formattedMonth;
            });
            setFilteredDatabases(filteredDatabases);
            setCurrentPage(1);
           
        } else {
            setFilteredDatabases(plans);
            setCurrentPage(1);
        }
    };

    const sidebar = services.map(service => {
        const serviceURL = `/services/${service.ma_dv}`;
        return (
            <li key={service.ma_dv}
                style={activeSidebar === service.ten_dv ? {
                    backgroundColor: '#fff'
                } : {}}>
                <Link className="link" to={serviceURL}>{service.ten_dv}</Link>
            </li>
        )
    })

    // export file
    const handleExport = (data) => {
        const columns = [
            { label: 'STT', formatter: (_, index) => index + 1 },
            { key: 'ma_congviec', label: 'Mã kế hoạch' },
            { key: 'ten_ke_hoach', label: 'Tên kế hoạch' },
            { key: 'ma_dv_display', label: 'Mã dịch vụ' },
            { key: 'ten_nv', label: 'Họ và tên' },
            { key: 'hrm', label: 'Mã HRM' },
            { key: 'thang', label: 'Tháng', formatter: (value) => format(new Date(value), 'MM-yyyy') },
            { key: 'chi_tieu', label: 'Chỉ tiêu' },
            { key: 'thuc_hien', label: 'Thực hiện' },
            { key: 'doanh_thu', label: 'Doanh thu' }
        ];

        const transformedData = data.map((item, index) => {
            const transformedItem = {};
            columns.forEach(column => {
                transformedItem[column.label] = column.formatter ? column.formatter(item[column.key], index) : item[column.key];
            });
            return transformedItem;
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(transformedData, { header: columns.map(column => column.label) });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(fileData, 'kehoach.xlsx');

    }


    // handle pagination
    const handlePagination = () => {
        setHome(
            filteredDatabases.slice(firstPostIndex, lastPostIndex).map(plan => (
                <Home key={plan.ma_congviec} plan={plan} identity={identity} />)
            )
        )
    }

    const handlePostsPerPage = (e) => {
        setPostsPerPage(e.target.value);
        setCurrentPage(1);
    }

    useEffect(() => {
        handlePagination();
    }, [filteredDatabases, currentPage, postsPerPage]);

    // JSX
    return (
        <div className="dashboard">
            <Header onLogout={handleLogout} identity={identity} />
            <div className="dashboard-content">
                <div className="container-fluid">
                    <h1 className="title">{activeSidebar}</h1>
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="dashboard-sidebar">
                                <h3>Danh mục</h3>
                                <ul className="dashboard-sidebar_list">
                                    <li style={activeSidebar === "Tất cả sản phẩm" ? {
                                        backgroundColor: '#fff'
                                    } : {}}
                                    ><Link className="link" to="/">Tất cả</Link>
                                    </li>
                                    {sidebar}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="dashboard-home">
                                <div className="dashboard-header">
                                    <div>
                                        <label htmlFor="showPosts">Hiện</label>
                                        <select className="dashboard-header-show" id="showPosts" defaultValue={5} onChange={(e) => { handlePostsPerPage(e) }}>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <label htmlFor="">Dòng</label>
                                    </div>
                                    <div>
                                        <label htmlFor="filterMonth">Tháng</label>
                                        <input className="dashboard-header-month" id="filterMonth" name="filterMonth"
                                            type="month"
                                            onChange={handleMonthChange}
                                        />
                                        {identity.phanquyen !== 0 ? (
                                            <button className="dashboard-header-export my-btn btn btn-success" onClick={() => handleExport(filteredDatabases.slice(firstPostIndex, lastPostIndex))}>Xuất file</button>
                                        ) : (<></>)
                                        }
                                    </div>
                                </div>
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            {identity.phanquyen !== 0 ? (
                                                <th >Tên nhân viên</th>
                                            ) : (<></>)
                                            }
                                            <th>Kế hoạch</th>
                                            <th>Chỉ tiêu</th>
                                            <th>Thực hiện</th>
                                            <th>Doanh thu</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            plans.length !== 0 ? (
                                                home
                                            ) : (
                                                <tr>
                                                    <td>Không có dữ liệu</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>

                                </table>
                            </div>
                            <Pagination
                                totalPosts={filteredDatabases.length}
                                postsPerPage={postsPerPage}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;