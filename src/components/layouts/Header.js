import React, { useState } from "react";
import logo from "../../images/logo.png";
import user from "../../images/user-default.jpg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Header = ({ onLogout, identity }) => {
    const [headerClassName, setHeaderClassName] = useState("header");
    const headerShadow = () => {
        if (window.scrollY >= 1) {
            setHeaderClassName("header active");
        } else {
            setHeaderClassName("header");
        }
    }
    window.addEventListener("scroll", headerShadow);

    // handle add service
    const [inputs, setInputs] = useState({
        ten_dv: "",
        ma_dv_display: "",
    });
    const { ten_dv, ma_dv_display } = inputs;

    const handleOnchange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const body = { ten_dv, ma_dv_display };
            console.log(body)
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/add-service`,
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
                }, 2000);

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
    const clearInput = () => {
        setInputs({
            ten_dv: "",
            ma_dv_display: "",
        });
    }

    // JSX
    return (
        <>
            <div className={headerClassName} id="myHeader">
                <div className="header-container container">
                    <div className="header-brand">
                        <a href="/"> <img src={logo} alt="logo-brand" /></a>
                    </div>
                    <div className="header-user">
                        <div className="avatar"
                            style={{
                                backgroundImage: `url(${user})`
                            }}
                        ></div>
                        <div className="info">
                            <p className="name">{identity.ten_nv}</p>
                            <p className="job">{identity.chucdanh}</p>
                        </div>
                        <div className="expand">
                            <ul>

                                {identity.phanquyen ? (
                                    <li>
                                        <Link to="/them-ke-hoach">Thêm kế hoạch</Link>
                                    </li>
                                ) : (<></>)
                                }

                                {identity.phanquyen === 1 ? (
                                    <li>
                                        <button
                                            type="button"
                                            className="btn btn-success my-btn dashboard-header-export"
                                            data-bs-toggle="modal"
                                            data-bs-target="#addServiceModal"
                                        >
                                            Thêm dịch vụ
                                        </button>
                                    </li>
                                ) : (<></>)
                                }

                                {identity.phanquyen === 1 ? (
                                    <li>
                                        <Link to="/quan-ly-nhan-vien">Danh sách nhân viên</Link>
                                    </li>
                                ) : (<></>)
                                }

                                <li>
                                    <button onClick={(e) => { onLogout(e) }}>Đăng xuất</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add service modal */}
            <div
                className="modal fade"
                id="addServiceModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="registerModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title" id="registerModalLabel">
                                Thêm dịch vụ
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => clearInput()}
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="register">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="ten_dv"
                                    required
                                    placeholder="Mời nhập tên dịch vụ"
                                    value={ten_dv}
                                    onChange={(e) => handleOnchange(e)}
                                />
                                <input
                                    className="form-control"
                                    type="text"
                                    name="ma_dv_display"
                                    placeholder="Mời nhập mã dịch vụ"
                                    value={ma_dv_display}
                                    required
                                    onChange={(e) => handleOnchange(e)}
                                />
                                <div className="register-group">
                                    <button
                                        type="button"
                                        className="my-btn btn btn-secondary"
                                        data-bs-dismiss="modal"
                                        onClick={() => clearInput()}
                                    > Đóng </button>
                                    <button type="submit" className="my-btn btn btn-primary">
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer />
        </>

    );
};



export default Header;