import React from 'react';
import { Link } from 'react-router-dom';


export default function Home({ plan, identity }) {
    const handleStatus = (persent) => {
        const detailURL = `/chi-tiet/${plan.ma_congviec}`;
        let statusStyle = {};
        let status = "";
        if (persent < 0.7) {
            status = "Báo động";
            statusStyle = "btn-outline-danger";
            // {
            //     backgroundColor: "#f5abae"
            // }
        } else if (persent >= 0.7 && persent < 0.9) {
            status = "Quan tâm";
            statusStyle = "btn-outline-warning";
        } else if (persent >= 0.9 && persent < 1) {
            status = "Chấp nhận";
            statusStyle = "btn-outline-info";
        } else {
            status = "Tốt";
            statusStyle = "btn-outline-success";
        }
        return (
            <Link className={'my-btn btn ' + statusStyle} title='Xem chi tiết'
                to={detailURL}
            >{status}</Link>
        );
    }
    let str = plan.ten_ke_hoach;
    if (str.length > 35) {
        str = str.substring(0, 35) + "...";
    }
    // JSX
    return (
        <tr>
            {plan.ten_nv ? (
                <td>{plan.ten_nv}</td>
            ) : (<></>)
            }
            <td>{str}</td>
            <td>{plan.chi_tieu}</td>
            <td>{plan.thuc_hien}</td>
            <td>{plan.doanh_thu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td className='dashboard-row_status'>
                {handleStatus(plan.thuc_hien / plan.chi_tieu)}
            </td>
        </tr>
    )
}
