import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
// import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/details.css";

export const Details = () => (
	<div className="text-center mt-5">
		<h1>Hello Details</h1>
		<Link to="/">Go home</Link>
	</div>
);