import { describe, it } from "@jest/globals";
import { createApplication } from "../helpers";
import { render, screen, waitFor } from "@testing-library/react";

import { userEvent } from "@testing-library/user-event";

describe("Бургер меню", () => {
	it("На ширине меньше 576px навигационное меню должно скрываться за гамбургер", async () => {
		window.innerWidth = 575;
		window.dispatchEvent(new Event("resize"));

		const app = createApplication();
		render(app);

		const toggle = await screen.findByLabelText("Toggle navigation");

		expect(toggle).toBeTruthy();
	});

	it("открывает меню при нажатии на гамбургер", async () => {
		window.innerWidth = 575;
		window.dispatchEvent(new Event("resize"));

		const app = createApplication();
		const { container } = render(app);

		const toggle = await screen.findByLabelText("Toggle navigation");
		const menu = await container.querySelector(".Application-Menu");

		await userEvent.click(toggle);

		expect(menu?.classList.contains("collapse")).toBe(false);
	});

	it("закрывает меню когда нажато дважды на гамбургер", async () => {
		window.innerWidth = 575;
		window.dispatchEvent(new Event("resize"));

		const app = createApplication();
		const { container } = render(app);

		const toggle = await screen.findByLabelText("Toggle navigation");
		const menu = await container.querySelector(".Application-Menu");

		await userEvent.click(toggle);
		await userEvent.click(toggle);

		expect(menu?.classList.contains("collapse")).toBe(true);
	});

	it("при выборе элемента из меню гамбургера, меню должно закрываться", async () => {
		window.innerWidth = 575;
		window.dispatchEvent(new Event("resize"));

		const app = createApplication();
		const { container } = render(app);

		const toggle = await screen.findByLabelText("Toggle navigation");
		const menu = await container.querySelector(".Application-Menu");

		await userEvent.click(toggle);
		await userEvent.click(screen.getByText("Delivery"));

		await waitFor(() =>
			expect(menu?.classList.contains("collapse")).toBe(true)
		);
	});
});
