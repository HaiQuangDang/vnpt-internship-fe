import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { ToastContainer, toast } from 'react-toastify';

const Manage = ({ setAuth }) => {
    const navigate = useNavigate();
    if (!localStorage.token) {
        navigate("/");
    }
    const [identity, setIdentity] = useState({});
    const [users, setUsers] = useState([]);
    const [updateUser, setUpdateUser] = useState({})

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
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        navigate("/");
    };
    useEffect(() => {
        getIdentity();
        getUsers();
    }, []);
    // user element
    const usersElement = users.map((user) => (
        <tr key={user.ma_nv}>
            <td>{user.ten_nv}</td>
            <td>{user.hrm}</td>
            <td>{user.chucdanh}</td>
            <td>{user.vitri}</td>
            <td>{user.sdt}</td>
            {user.phanquyen === 0 ? (
                <td>Xem</td>
            ) : (<td>Sửa</td>)
            }
            <td>
                <button
                    type="button"
                    className="btn-update-user btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#updateUserModal"
                    onClick={() => setUpdateUser(user)}
                >
                    Cập nhật
                </button></td>
        </tr>
    ))
    // *****************register
    const [inputs, setInputs] = useState({
        ten_nv: "",
        hrm: "",
        chucdanh: "",
        vitri: "",
        sdt: "",
        matkhau: "",
        phanquyen: ""
    });
    const { ten_nv, hrm, chucdanh, vitri, sdt, matkhau, phanquyen } = inputs;

    const handleOnchange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const body = { ten_nv, chucdanh, vitri, sdt, hrm, matkhau, phanquyen };
            console.log(body)
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`,
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
    // update user
    const [updateInputs, setUpdateInputs] = useState({
        update_chucdanh: "",
        update_vitri: "",
        update_sdt: "",
        update_phanquyen: ""
    });
    const { update_chucdanh, update_vitri, update_sdt, update_phanquyen } = updateInputs;
    const handleOnchangeUpdate = (e) => {
        setUpdateInputs({ ...updateInputs, [e.target.name]: e.target.value })
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const body = { update_chucdanh, update_vitri, update_sdt, update_phanquyen };
            console.log(body, updateUser.ma_nv);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/update-user/${updateUser.ma_nv}`,
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
    const onUpdateUser = () => {
        if (updateUser) {
            return (
                <div
                    className="modal fade"
                    id="updateUserModal"
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
                                    Cập nhật thông tin nhân viên
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
                                <form onSubmit={handleUpdate} className="register">
                                    <input
                                        className="form-control"
                                        type="text"
                                        required
                                        placeholder="Mời nhập họ và tên"
                                        defaultValue={updateUser.ten_nv}
                                        disabled
                                    />
                                    <input
                                        className="form-control"
                                        type="text"
                                        required
                                        placeholder="Mời nhập mã HRM"
                                        defaultValue={updateUser.hrm}
                                        disabled
                                    />
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="update_chucdanh"
                                        placeholder="Chức danh"
                                        // defaultValue={updateUser.chucdanh}
                                        value={update_chucdanh}
                                        required
                                        onChange={(e) => handleOnchangeUpdate(e)}
                                    />
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="update_vitri"
                                        placeholder="Vị trí công việc"
                                        // defaultValue={updateUser.vitri}
                                        value={update_vitri}
                                        required
                                        onChange={(e) => handleOnchangeUpdate(e)}
                                    />
                                    <div className="row">
                                        <div className="col-6">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="update_sdt"
                                                placeholder="Số điện thoại"
                                                // defaultValue={updateUser.sdt}
                                                value={update_sdt}
                                                required
                                                onChange={(e) => handleOnchangeUpdate(e)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <select
                                                className="form-control" name="update_phanquyen"
                                                required
                                                onChange={(e) => handleOnchangeUpdate(e)}
                                            >
                                                <option value="">Mời phân quyền nhân viên</option>
                                                <option value={0}>Người xem</option>
                                                <option value={2}>Người chỉnh sửa</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="register-group">
                                        <button type="button" 
                                        className="my-btn deletle-user btn btn-danger"
                                        onClick={() => handleDeleteUser()}
                                        >Xóa</button>
                                        <button
                                            type="button"
                                            className="my-btn btn btn-secondary"
                                            data-bs-dismiss="modal"
                                            onClick={() => clearInput()}
                                        > Đóng </button>
                                        <button type="submit" className="my-btn btn btn-primary">
                                            Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else return (<></>)
    }

    const clearInput = () => {
        setInputs({
            ten_nv: "",
            hrm: "",
            chucdanh: "",
            vitri: "",
            sdt: "",
            matkhau: "",
            phanquyen: ""
        });
        setUpdateInputs({
            update_chucdanh: "",
            update_vitri: "",
            update_sdt: "",
            update_phanquyen: ""
        });
    }

    //************** delete user */
    const deleteUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/delete-user/${updateUser.ma_nv}`,
                {
                    method: "DELETE",
                    headers: { token: localStorage.token },
                }
            )
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

    const handleDeleteUser = () => {
        if (window.confirm("Bạn có chắc chăn muốn xóa nhân viên này?")) {
            deleteUser();
        }
    }

    // ********************JSX
    return (
        <>
            <div className="dashboard manage">
                <Header onLogout={handleLogout} identity={identity} />
                <div className="dashboard-content">
                    <div className="container-fluid">
                        <div className="dashboard-header">
                            <h1 className="title">Quản lý nhân viên</h1>
                            <button
                                type="button"
                                className="btn btn-success my-btn  dashboard-header-export"
                                data-bs-toggle="modal"
                                data-bs-target="#registerModal"
                            >
                                Thêm nhân viên
                            </button>
                        </div>

                        <div className="dashboard-home">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "250px" }}>Họ và tên</th>
                                        <th>Mã HRM</th>
                                        <th>Chức danh công việc</th>
                                        <th>Vị trí công việc</th>
                                        <th>Số điện thoại</th>
                                        <th>Quyền</th>
                                        <th>Thay đổi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.length !== 0 ? (
                                            usersElement
                                        ) : (
                                            <tr>
                                                <td>Không có dữ liệu</td>
                                            </tr>
                                        )
                                    }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>


            {/* Modal */}
            <div
                className="modal fade"
                id="registerModal"
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
                                Thêm nhân viên
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
                                    name="ten_nv"
                                    required
                                    placeholder="Mời nhập họ và tên"
                                    value={ten_nv}
                                    onChange={(e) => handleOnchange(e)}
                                />
                                <div className="row">
                                    <div className="col-6">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="hrm"
                                            required
                                            placeholder="Mời nhập mã HRM"
                                            value={hrm}
                                            onChange={(e) => handleOnchange(e)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="matkhau"
                                            placeholder="Mời nhập mật khẩu"
                                            value={matkhau}
                                            required
                                            onChange={(e) => handleOnchange(e)}
                                        />
                                    </div>
                                </div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="chucdanh"
                                    placeholder="Chức danh"
                                    value={chucdanh}
                                    required
                                    onChange={(e) => handleOnchange(e)}
                                />
                                <input
                                    className="form-control"
                                    type="text"
                                    name="vitri"
                                    placeholder="Vị trí công việc"
                                    value={vitri}
                                    required
                                    onChange={(e) => handleOnchange(e)}
                                />
                                <div className="row">
                                    <div className="col-6">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="sdt"
                                            placeholder="Số điện thoại"
                                            value={sdt}
                                            required
                                            onChange={(e) => handleOnchange(e)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <select
                                            className="form-control" name="phanquyen"
                                            onChange={(e) => handleOnchange(e)}
                                            required
                                        >
                                            <option value="">Mời phân quyền nhân viên</option>
                                            <option value={0}>Người xem</option>
                                            <option value={2}>Người chỉnh sửa</option>
                                        </select>
                                    </div>
                                </div>

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


            {onUpdateUser()}

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

export default Manage;