import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import serviceImg1 from "../images/service1.png";
import serviceImg2 from "../images/service2.jpg";
import serviceImg3 from "../images/service3.jpg";
import goal from "../images/Polygon.svg";
import done from "../images/star.svg";
import left from "../images/left.svg";
import percent from "../images/chart.svg";
import money from "../images/money.svg";
import pen from "../images/pen.svg";
import saler from "../images/person.svg";
import bill from "../images/crypto.svg";
import { ToastContainer, toast } from 'react-toastify';

const Detail = ({ setAuth }) => {
    const navigate = useNavigate();
    if (!localStorage.token) {
        navigate("/");
    }
    const { id } = useParams();
    const [identity, setIdentity] = useState({});
    const [plan, setPlan] = useState({});

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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/detail/${id}`,
                {
                    method: "GET",
                    headers: { token: localStorage.token },
                }
            )
            const parseRes = await response.json();
            if (parseRes) {
                setPlan(parseRes);
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
        getPlan();
    }, []);

    // status
    const handleStatus = (percent) => {
        let statusStyle = {};
        let status = "";
        if (percent < 0.7) {
            status = "Báo động";
            statusStyle = "btn-danger";
        } else if (percent >= 0.7 && percent < 0.9) {
            status = "Cần quan tâm";
            statusStyle = "btn-warning";
        } else if (percent >= 0.9 && percent < 1) {
            status = "Được chấp nhận";
            statusStyle = "btn-info";
        } else {
            status = "Hoàn thành tốt";
            statusStyle = "btn-success";
        }
        return (
            <div className={"detail-status btn " + statusStyle} ><h5>{status}</h5></div>
        );
    }
    const headingURL = `/services/${plan.ma_dv}`;

    const handleServiceImg = () => {
        if (plan.ma_dv === 1) {
            return { backgroundImage: `url(${serviceImg1})` }
        }
        else if (plan.ma_dv === 2) {
            return { backgroundImage: `url(${serviceImg2})` }
        }
        else {
            return { backgroundImage: `url(${serviceImg3})` }
        }
    }

    const dateFormat = (d) => {
        const date = new Date(d);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        return formattedDate;
    }

    const monthFormat = (m) => {
        const newMonth = new Date(m);
        const formattedDate = newMonth.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });
        return formattedDate
    }

    // *************************************update put in here
    const ten_nguoi_cap_nhat = identity.ten_nv;
    const [inputs, setInputs] = useState({
        thuc_hien: "",
        doanh_thu: ""
    })
    let { thuc_hien, doanh_thu } = inputs;
    const handleOnChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { thuc_hien, doanh_thu, ten_nguoi_cap_nhat };
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/update-row/${plan.ma_congviec}`,
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
            console.error(error);
        }
    }
    //************** delete  */
    const deleteDetail = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/delete/${id}`,
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
                    navigate("/");
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

    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chăn muốn xóa kế hoạch này?")) {
            deleteDetail();
        }
    }
    // JSX
    return (
        <>
            <Header onLogout={handleLogout} identity={identity} />

            {plan ? (
                <div className="detail">
                    <div className="container">
                        <div className="detail-heading">
                            <Link className="detail-nav" to="/">Trang chủ </Link>
                            <span className="separate">/</span>
                            <Link className="detail-nav" to={headingURL}>{plan.ten_dv}</Link>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-lg-5 col-xl-4">
                                <div className="detail-img"
                                    style={handleServiceImg()}
                                ></div>
                            </div>
                            <div className="col-md-8 col-lg-7 col-xl-8">
                                <div className="detail-content">
                                    <h2 className="detail-title">{plan.ten_ke_hoach}</h2>
                                    {plan.ten_nv ? (
                                        <div className="detail-saler">
                                            <img src={saler} alt="" />
                                            <span>{plan.ten_nv}</span>
                                        </div>
                                    ) : (<></>)}
                                    {handleStatus(plan.thuc_hien / plan.chi_tieu)}
                                    {/* fixing ................ */}
                                    <h5 className="detail-month">Tháng diễn ra kế hoạch:  {monthFormat(plan.thang)}</h5>
                                    <div className="detail-stat">
                                        <div>
                                            <img src={goal} alt="" />
                                            <h5>Chỉ tiêu: {plan.chi_tieu}</h5>
                                        </div>
                                        <div>
                                            <img src={done} alt="" />
                                            <h5>Đã thực hiện: {plan.thuc_hien}</h5>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <div>
                                            <img src={left} alt="" />
                                            <h5>Còn lại: {plan.con_lai}</h5>
                                        </div>
                                        <div>
                                            <img src={percent} alt="" />
                                            <h5>Tỷ lệ hoàn thành: {
                                                (Math.round(plan.thuc_hien / plan.chi_tieu * 100) / 100).toFixed(2) * 100
                                            }%</h5>
                                        </div>
                                    </div>
                                    <div className="detail-revenue">
                                        <img src={money} alt="" />
                                        <h3>Doanh thu: {
                                            plan.doanh_thu ? (
                                                plan.doanh_thu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }
                                                )) : (<>0</>)
                                        }</h3>
                                    </div>
                                    {/* fixing ................ */}
                                    <div className="detail-update">
                                        <img src={bill} alt="" />
                                        <p>Mã kế hoạch: {plan.ma_congviec}</p>
                                    </div>
                                    <div className="detail-update">
                                        <img src={pen} alt="" />
                                        <p>Ngày cập nhật mới nhất: {dateFormat(plan.ngay_cap_nhat)}</p>
                                    </div>

                                    <div className="detail-update">
                                        <p>Bởi: {plan.ten_nguoi_cap_nhat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {plan.ten_nv ? (
                            <div className="detail-action">
                                <button type="button" onClick={() => handleDelete()}
                                    className="my-btn btn btn-danger detail-action-delete">
                                    Xóa
                                </button>
                                <button className="my-btn btn btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#updateModal"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        ) : (<></>)}


                    </div>
                </div>
            ) : (<></>)
            }

            <>
                <div
                    className="modal fade"
                    id="updateModal"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="updateModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="my-update-modal">
                                <form onSubmit={handleOnSubmit} className="update-form my-form">
                                    <div className="modal-header">
                                        <h2 className="modal-title" id="updateModalLabel">
                                            {plan.ten_ke_hoach}
                                        </h2>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <label htmlFor="thuc_hien" className="form-label">Thực hiện</label>
                                        <input className="form-control" id="thuc_hien"
                                            name="thuc_hien" min={1} type="number"
                                            required
                                            value={thuc_hien}
                                            onChange={(e) => { handleOnChange(e) }}
                                        />
                                        <label htmlFor="doanh_thu" className="form-label">Doanh thu</label>
                                        <input className="form-control" id="doanh_thu"
                                            name="doanh_thu" min={1} type="number"
                                            required
                                            value={doanh_thu}
                                            onChange={(e) => { handleOnChange(e) }}
                                        />

                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="my-btn btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >Đóng</button>
                                        <button type="submit" className="my-btn btn btn-primary">
                                            Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            <Footer />

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

export default Detail;