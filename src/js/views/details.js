import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import noImage from "../../img/big-placeholder.jpg";
import "../../styles/details.css";
import { Context } from "../store/appContext"
import { object } from "prop-types";

export const Details = () => {

	let state = useContext(Context);

	const details = state.actions.set_getDetails();
	delete details.url;
	delete details.edited;
	delete details.created;
	Object.entries(details).map(([key, prop]) => {
		if (prop[0]?.slice(0, 8) === "https://") {
			delete details[key]
		}
	})
	console.log(`details: using state.store.details, this in it now: `)
	console.log(state.store.details)

	return(
		<div className="container border border-info border-opacity-25 rounded-4 py-2 px-2" style={{Width: "90vw"}}>
			<div className="row">
				<div className="col-6">
					<img src={noImage} alt = {`an image of ${details.description || "nothing, nothing selected"}`} style={{Width: "100%"}} className="rounded-4"/>
					{/*<img src={`https://starwars-visualguide.com/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`}
						onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
						alt = {`an image of${state.store.details?.description}`}
						class="img-fluid rounded-start"
						style={{Width: "50%"}}
						/>*/}
				</div>
				<div className="col-6">
					{console.log(`details: entering card body, this is details: ${details}`)}
					<div className="card-body text-wrap">
						<h5 className="card-title my-3">{details.name || "nothing selected"}</h5>
						{Object.entries(details).map(([key, value], index) => {
							console.log(`creating <p> with: ${key}: ${value}`)
							return <p className="card-text" key={index}>{state.actions.prepareKey([key, value])}</p>
						}) //closing map
						}
					</div>
				</div>
			</div>
			<Link to="/" className="btn btn-outline-primary m-4">Go home</Link>
		</div>
		
)};