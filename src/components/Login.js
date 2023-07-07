import React, { useState } from "react";
import logo from "../images/logo.png";
import background from "../images/bg-login-fix.svg";
import { ToastContainer, toast } from 'react-toastify';

const Login = ({ setAuth, ...props }) => {
    const [inputs, setInputs] = useState({
        hrm: "",
        matkhau: ""
    })
    const { hrm, matkhau } = inputs;
    const handleOnChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { hrm, matkhau };
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }

            );
            const parseRes = await response.json();
            if (response.status === 200) {
                if (parseRes) {
                    localStorage.setItem("token", parseRes.token);
                    setAuth(true);
                } else {
                    setAuth(false);
                }
            } else if (response.status === 401) {

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


            // passwordIncorrect();
        } catch (error) {
            console.error(error.message);
        }
    }
    // notify



    //  *************** JSX
    return (
        <>
            <div className="login" style={{ backgroundImage: `url(${background})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login-welcome">
                                <h1>TẬP ĐOÀN VNPT</h1>
                                <p>Chào mừng bạn đến với nền tảng quản lý bán hàng trực tuyến</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login-modal">
                                <div className="login-modal__heading">
                                    <img src={logo} alt="logo" />
                                    <h2>ĐĂNG NHẬP</h2>
                                </div>
                                <form onSubmit={handleOnSubmit} className="login-form">
                                    <label htmlFor="loginUserHRM" className="form-label">
                                        <i className="fa-solid fa-asterisk" /> Mã HRM
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="loginUserHRM"
                                        name="hrm"
                                        required
                                        placeholder="Mời nhập mã HRM..."
                                        value={hrm}
                                        onChange={(e) => { handleOnChange(e) }}
                                    />
                                    <label htmlFor="loginUserPassword" className="form-label">
                                        <i className="fa-solid fa-asterisk" /> Mật khẩu
                                    </label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        id="loginUserPassword"
                                        name="matkhau"
                                        placeholder="Mời nhập mật khẩu..."
                                        value={matkhau}
                                        required
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                    <div className="submit-form">
                                        <button type="submit" className="my-btn my-btn-primary btn btn-primary">Đăng nhập</button>
                                    </div>
                                </form>
                            </div>
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
    )
}

























export default Login;