import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { initStore } from "../src/client/store";
import React from "react";
import { Application } from "../src/client/Application";
import { CartApi, ExampleApi } from "../src/client/api";
import { BASE_URL } from "./testplane/utils";

export const createApplication = (
	api: ExampleApi | undefined = new ExampleApi(BASE_URL),
	cart: CartApi | undefined = new CartApi()
) => {
	const store = initStore(api, cart);

	return (
		<MemoryRouter>
			<Provider store={store}>
				<Application />
			</Provider>
		</MemoryRouter>
	);
};
