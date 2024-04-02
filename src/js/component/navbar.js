import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/star-wars-logo.png";
import { Context } from "../store/appContext"

export const Navbar = () => {

	const state = useContext(Context);
	const data = state.actions.set_get_deleteFavorites("get");

	
	return (
		<nav className="navbar navbar-light bg-light mb-3">
			<Link to="/">
			<img src={logo} alt="SW logo" className="mx-4" style={{height: "3vw", width: "auto"}}/>
			</Link>
			<div className="ml-auto">

			<button className="btn btn-danger mx-5" onClick={() => {localStorage.clear(); console.log("localStorage cleared")}}>Clear local storage</button>


				<button className="btn btn-primary mx-5" onClick={() => state.actions.getData(["species", "starships"], "storage2")}>Get Species and Starships</button>
	

			<div className="btn-group">
  <button type="button" className="btn btn-primary dropdown-toggle mx-5" data-bs-toggle="dropdown" aria-expanded="false">
    Favorites <span className="text-light bg-secondary px-1 rounded-1">{data.length}</span>
  </button>
  <ul className="dropdown-menu p-4">
  {
	data.length === 0 ? <p>{"(empty)"}</p> :
	data.map((details, index) => {
	return(
		<div key={index + 1000} className="d-flex justify-content-between">
			<Link to={`/details/${details.name}`} style={{textDecoration: "none", fontWeight: "500"}} onClick={() => state.actions.set_getDetails(details)}>{details.name}</Link>
			<button type="button" className="btn btn-light py-0 px-1" onClick={(e) => {state.actions.set_get_deleteFavorites("delete", index); e.stopPropagation()}}><i className="fa-solid fa-trash"></i></button>
		</div>
)}) // closing map and return
}
  </ul>
</div>





			</div>
		</nav>
	);
};







