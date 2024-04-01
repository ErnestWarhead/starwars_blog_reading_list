import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./views/home";
import { Details } from "./views/details";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";

import { Context } from "./store/appContext"

const Layout = () => {

	const state = useContext(Context);

	return (
		<div>
			<BrowserRouter>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path={`/details/${state.store.details?.name || "/details"}`} element={<Details />} />
						<Route path="*" element={<Home />} />
					</Routes>
			</BrowserRouter>
		</div>
	);
};

export default injectContext(Layout);