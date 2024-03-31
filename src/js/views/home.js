import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
// import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Context } from "../store/appContext"

export const Home = () => {

	const state = useContext(Context);
	if (state.store.memos && state.store.memos[0] !== "exit screen"){
	return (
	<div className="text-center mt-5">
		<h1>Loading...</h1>
		{state.store.memos?.map((value, index) => (<p key={index}>{value}</p>))}
		<Link to="/details">Go to details</Link>
	</div>
	)  //closing return
	} else {
		return (
			<div className="text-center mt-5">
				<h1>Hello Home</h1>
				<Link to="/details">Go to details</Link>
			</div>
		)
	}
	}  //closing Home