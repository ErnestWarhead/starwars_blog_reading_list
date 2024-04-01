import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import noImage from "../../img/big-placeholder.jpg";
import "../../styles/home.css";
import { Context } from "../store/appContext"

export const Home = () => {

	const state = useContext(Context);
	console.log("Home is rendering now:");
	if (state.store.memos && state.store.memos[0] !== "exit screen"){
		console.log("home: loading screen");
	return (
	<div className="text-center mt-5">
		<h1 className="m-4">Loading...</h1>
		{state.store.memos?.map((value, index) => (<p className="m-4" key={index}>{value}</p>))}
	</div>
	)  //closing return
	} else if (Object.entries(state.store).length === 0) {
		console.log("home: storage is empty, returning null");
		return null;
	} else {
		console.log("home: starting to render the cards");
		return (
		Object.entries(state.store).map(([type, data], index) => {
			if (type === "memos" || type === "favorites" || type === "details") {console.log("skipped memos, favorites or details, returning null"); return null};
			console.groupCollapsed(`rendering cards with ${type}`);
			return (
				<div key={index}>
				<h1>{`${type[0].toUpperCase()}${type.slice(1)}`}</h1>
				<div className="container-fluid">
					<div className="row">
						<div className="d-flex flex-row scrollable-row">
						

						{Object.entries(data).map(([uid, details], place) => {
							console.log(`renedering card of ${details.properties.name}`);
							return(
							<div className="card mb-3 me-4" style={{width: "18rem"}} key={place}>
								<img src={noImage} alt = {`an image of${details.description}`} />
								{/*<img src={`https://starwars-visualguide.com/assets/img/${type === "people" ? "characters" : type}/${uid}.jpg`}
									onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
							alt = {`an image of${details.description}`} />*/}
								<div className="card-body text-wrap d-flex flex-column">
									<h5 className="card-title">{details.properties?.name || ""}</h5>
									<p className="card-text m-0">{type === "planets" ? "" : state.actions.prepareKey(Object.entries(details.properties)[2])}</p>
									<p className="card-text m-0">{state.actions.prepareKey(Object.entries(details.properties)[4])}</p>
									<p className="card-text m-0">{state.actions.prepareKey(Object.entries(details.properties)[6])}</p>
									<div className = "container d-flex justify-content-between p-0 pt-3 mt-auto" style={{position: "relative", bottom: "1vw"}}>
										<Link to={`/details/${details.properties?.name}`} className="btn btn-outline-primary" onClick={() => state.actions.set_getDetails(details.properties)}>Learn more!</Link>
										<button type="button" className="btn btn-outline-warning"><i className="fa-regular fa-heart"></i></button>
									</div>
								</div>
							</div>
						)}) // closing inner map and return
						}
						{console.groupEnd()}
						

						</div>
					</div>
				</div>
				</div>
			)// closing return
		})  //closing map
	)  //closing return from else
	}  //closing else
}  //closing Home