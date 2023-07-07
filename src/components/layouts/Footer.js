import React from "react";
import bannerFooter from "../../images/background-footer.png";
import logo from  "../../images/logo-footer.svg";

function Footer() {
    return (
        <div className="footer">
            <div className="footer-banner">
                <img src={bannerFooter} alt="" />
            </div>
            <img className="footer-logo" src={logo} alt="" />
        </div>
    );
}

export default Footer;