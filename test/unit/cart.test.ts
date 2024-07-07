import { createApplication } from "../helpers";
import { BASE_NAME } from "../testplane/utils";
import { findByText, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MockApi, MockCartApi, mockCartData, mockProducts } from "../mock";

describe("Проверка страницы с корзиной", () => {
	it("В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		const productItems = await waitFor(() =>
			container.querySelectorAll(".ProductItem")
		);

		productItems.forEach(async (item) => {
			const link = item.querySelector(".ProductItem-DetailsLink");
			if (link) await userEvent.click(link);
			await waitFor(() => {
				userEvent.click(
					screen.getByRole("button", { name: "Add to Cart" })
				);
			});
			await userEvent.click(
				screen.getByRole("link", { name: "Catalog" })
			);
		});

		findByText(container, `Cart (${mockProducts.length})`);
	});

	it("В корзине должна отображаться таблица с добавленными в нее товарами", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const productItems = await waitFor(() =>
			container.querySelectorAll(".ProductItem")
		);

		if (productItems) {
			const link = productItems[0].querySelector(
				".ProductItem-DetailsLink"
			);
			if (link) await userEvent.click(link);
		}

		const btn = screen.getByRole("button", { name: "Add to Cart" });
		await userEvent.click(btn);

		await userEvent.click(screen.getByRole("link", { name: "Cart (1)" }));
		expect(container.querySelector(".Cart-Table")).toBeDefined();
	});

	it("для каждого товара должны отображаться название, цена, количество, стоимость, а также должна отображаться общая сумма заказа", async () => {
		const cartApi = new MockCartApi();
		cartApi.setState(mockCartData);

		const { container } = render(
			createApplication(new MockApi(BASE_NAME), cartApi)
		);

		await userEvent.click(
			screen.getByRole("link", {
				name: `Cart (${Object.keys(mockCartData).length})`,
			})
		);

		const tableItems = await waitFor(() =>
			container.querySelectorAll("tbody tr")
		);

		const cartState = cartApi.getState();

		tableItems.forEach((item, index) => {
			const name = item.querySelector(".Cart-Name")!;
			const price = item.querySelector(".Cart-Price")!;
			const count = item.querySelector("Cart-Counter")!;
			const total = item.querySelector(".Cart-Total")!;

			waitFor(() => {
				expect(name.textContent).toBe(cartState[index].name);
				expect(price.textContent).toBe(`$${cartState[index].price}`);
				expect(count.textContent).toBe(`${cartState[index].count}`);
				expect(total.textContent).toBe(
					`$${cartState[index].price * cartState[index].count}`
				);
			});
		});
	});

	it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
		const cartApi = new MockCartApi();
		cartApi.setState(mockCartData);

		const { container } = render(
			createApplication(new MockApi(BASE_NAME), cartApi)
		);

		await userEvent.click(
			screen.getByRole("link", {
				name: `Cart (${Object.keys(mockCartData).length})`,
			})
		);

		const btn = screen.getByRole("button", {
			name: "Clear shopping cart",
		});

		expect(btn).toBeTruthy();
		await userEvent.click(btn);
		expect(container.querySelector(".Cart-Table")).toBeNull();
	});

	it("если корзина пустая, должна отображаться ссылка на каталог товаров", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Cart" }));

		expect(
			screen.getByText("Cart is empty. Please select products in the .")
		).toBeTruthy();
		expect(screen.getByRole("link", { name: "catalog" })).toBeTruthy();
	});
});
