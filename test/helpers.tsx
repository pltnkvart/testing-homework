import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { initStore, ApplicationState } from "../src/client/store";
import React, { ReactElement } from "react";
import { Application } from "../src/client/Application";
import { render, RenderResult } from "@testing-library/react";
import { CartApi, ExampleApi } from "../src/client/api";

export const appRender = (
	entries: [string, ...string[]],
	store?: ReturnType<typeof initStore>
) => {
	store = store ?? initStore(new ExampleApi("/hw/store"), new CartApi());

	const application = (
		<MemoryRouter initialEntries={entries} initialIndex={0}>
			<Provider store={store}>
				<Application />
			</Provider>
		</MemoryRouter>
	);

	return application;
};
