import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { mapValues } from 'lodash';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { ToastContainer, toast } from 'react-toastify';
import mau from '../images/maukehoach.xlsx';

const Insert = ({ setAuth }) => {
    const navigate = useNavigate();
    if (!localStorage.token) {
        navigate("/");
    }

    const [identity, setIdentity] = useState({});
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);

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

    const getUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/select-users`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            )
            const parseRes = await response.json();
            if (Array.isArray(parseRes)) {
                setUsers([...parseRes]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getServices = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/select-services`,
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
        navigate("/");
    };
    useEffect(() => {
        getIdentity();
        getUsers();
        getServices();
    }, []);

    const ten_nguoi_cap_nhat = identity.ten_nv;

    const usersElement = users.map(user => (
        <option key={user.ma_nv} value={user.ma_nv}>{user.ten_nv}</option>
    ))

    const servicesElement = services.map(service => (
        <option key={service.ma_dv} value={service.ma_dv}>{service.ten_dv}</option>
    ))


    // *************************************post in here

    const [inputs, setInputs] = useState({
        ma_nv: "",
        ma_dv: "",
        ten_ke_hoach: "",
        thang: "",
        chi_tieu: "",
        ten_nguoi_cap_nhat: ten_nguoi_cap_nhat
    })
    const { ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu } = inputs;
    const handleOnChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat };
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/insert-row`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }

            );
            const parseRes = await response.json();
            if (response.status === 200) {
                toast.success(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                toast.error(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    // import insert file is here
    const convertDates = (data) => {
        return data.map((row) => {
            return mapValues(row, (value, key) => {
                if (key === 'Tháng' && typeof value === 'number' && value >= 1 && value <= 2958465) {
                    const date = new Date((value - 25569) * 86400 * 1000);
                    const month = date.getUTCMonth() + 1; // UTC month is zero-based
                    const year = date.getUTCFullYear();

                    return new Date(Date.UTC(year, month - 1, 1));
                }
                return value;
            });
        });
    };

    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            const convertedData = convertDates(parsedData);
            handleOnImport(convertedData);
        };
    }

    const handleOnImport = async (data) => {
        try {
            const body = { data, ten_nguoi_cap_nhat };
            console.log(body)
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/import-congviec`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }

            );
            const parseRes = await response.json();
            if (response.status === 200) {
                toast.success(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                toast.error(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    // update by import file here

    const handleFileUpdate = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            const convertedData = convertDates(parsedData);
            handleOnUpdate(convertedData);
        };
    }

    const handleOnUpdate = async (data) => {

        try {
            const body = { data, ten_nguoi_cap_nhat };
            console.log(body)
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/update-congviec`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }

            );
            const parseRes = await response.json();
            if (response.status === 200) {
                toast.success(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } else {
                toast.error(parseRes, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.error(error.message);
        }
    }


    // JSX
    return (
        <>
            <Header onLogout={handleLogout} identity={identity} />
            <div className="insert">
                <div className="insert-content">
                    <div className="container-xl">
                        <div className="insert-heading">
                            <h1 className="insert-title">thêm kế hoạch</h1>
                        </div>
                        <div className="insert-import">
                            <label htmlFor="insertFile">Thêm file kế hoạch</label>
                            <input id="insertFile" className="" type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload} />
                        </div>

                        <div className="insert-import">
                            <label htmlFor="updateFile">Cập nhật kế hoạch</label>
                            <input className="" type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpdate}
                            />
                        </div>
                        <div className="insert-import">
                            <a href={mau}>Mẫu file thêm kế hoạch</a>
                        </div>
                        <form onSubmit={handleOnSubmit} className="insert-form">
                            <div className="row mb-5">
                                <div className="col-md-4 offset-md-2">
                                    <div className="insert-form_input">
                                        <label htmlFor="thang">Tháng diễn ra kế hoạch</label>
                                        <input className="form-control" id="thang" name="thang"
                                            type="month" value={thang} required
                                            onChange={(e) => { handleOnChange(e) }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="insert-form_input">
                                        <label htmlFor="chi_tieu">Chỉ tiêu</label>
                                        <input className="form-control" id="chi_tieu"
                                            name="chi_tieu" min={1} type="number"
                                            value={chi_tieu} required
                                            onChange={(e) => { handleOnChange(e) }}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="row mb-5">
                                <div className="col-md-4 offset-md-2">
                                    <div className="insert-form_select">
                                        <select
                                            className="form-select"
                                            name="ma_nv" id="ma_nv"
                                            defaultValue="defaultOption" required
                                            onChange={(e) => { handleOnChange(e) }}
                                        >
                                            <option value="defaultOption" disabled>Mời chọn nhân viên thực hiện</option>
                                            {usersElement}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="insert-form_select">
                                        <select
                                            className="form-select"
                                            name="ma_dv" id="ma_dv" required
                                            defaultValue="defaultOption"
                                            onChange={(e) => { handleOnChange(e) }}
                                        >
                                            <option value="defaultOption" disabled>Mời chọn dịch vụ</option>
                                            {servicesElement}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-md-8 offset-md-2">
                                    <div className="insert-form_textarea">
                                        <textarea
                                            className="form-control"
                                            placeholder="Mời nhập tên kế hoạch"
                                            name="ten_ke_hoach"
                                            value={ten_ke_hoach} required
                                            onChange={(e) => { handleOnChange(e) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="insert-form_submit my-btn btn btn-primary" type="submit">Thêm</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
        </>

    );
}

export default Insert;