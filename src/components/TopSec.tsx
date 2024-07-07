import './TopSec.css';
import { Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import getImageURL from "../utils/image-util";
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import useInfoApi from '../hooks/useInfoApi';
import { FaCaretDown } from 'react-icons/fa';

export default function TopSec() {
  const context = useContext(UserContext);

  if (!context) {
    return null;
  }


  const { user, isAuthenticated } = context;
  const info = useInfoApi();

  return (
    <>
      <Navbar className="topnav">
        <Nav>
          <NavLink to="/" className={({ isActive }) => "nav-link responsive" + (isActive ? " active" : "")} end>
            <img src={getImageURL("dc.png")} alt="DC Picture" className="navHome" />&nbsp;
            <span className='navHome-Title'>DC Elections</span>
          </NavLink>
        </Nav>
        {isAuthenticated && (
          <>
            <NavLink to="/elections" className={({ isActive }) => "nav-link responsive" + (isActive ? " active" : "")} end>
              Elections
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => "nav-link responsive" + (isActive ? " active" : "")} end>
              History
            </NavLink>
            <div className="dropdown responsive">
              <FaCaretDown />
              <div className="dropdown-content">
                <p className='responsive'>Total:&nbsp;{(info?.info?.closedElections || 0) + (info?.info?.openElections || 0)}</p>
                <p className='responsive'>Open:&nbsp;{info?.info?.openElections ? info.info.openElections : 0}</p>
                <p className='responsive'>Closed:&nbsp;{info?.info?.closedElections}</p>
              </div>
            </div>
            <NavLink to="/" className={({ isActive }) => "nav-link responsive" + (isActive ? " active" : "")} end>
              <img src={getImageURL("default-pfp.jpg")} alt={`${user?.username}'s Profile Picture`} className='pfp' />
            </NavLink>
          </>
        )}
      </Navbar>
      <Outlet></Outlet>
    </>
  )
}
/*
<div class="topnav" id="myTopnav">
<a href="#home" class="active">Home</a>
<a href="#news">News</a>
<a href="#contact">Contact</a>
<div class="dropdown">
  <button class="dropbtn">Dropdown 
    <i class="fa fa-caret-down"></i>
  </button>
  <div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div> 
<a href="#about">About</a>
<a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
</div>
*/