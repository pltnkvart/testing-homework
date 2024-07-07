import userEvent from "@testing-library/user-event";
import { createApplication } from "../helpers";
import { BASE_NAME } from "../testplane/utils";
import { MockApi, MockCartApi, mockProducts } from "../mock";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Проверка страницы с каталогом", () => {
	const api = new MockApi(BASE_NAME);
	const cartApi = new MockCartApi();
	it("В каталоге должны отображаться товары, список которых приходит с сервера", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await waitFor(() => {
			fireEvent.click(screen.getByRole("link", { name: "Catalog" }));
		});

		expect(container.querySelectorAll(".ProductItem").length).toBe(
			mockProducts.length
		);
	});

	it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const productElements = await waitFor(() =>
			container.querySelectorAll(".ProductItem")
		);

		productElements.forEach(async (productElement, index) => {
			await waitFor(() => {
				expect(productElement.querySelector(".ProductItem-Name")).toBe(
					mockProducts[index].name
				);
				expect(productElement.querySelector(".ProductItem-Price")).toBe(
					mockProducts[index].price
				);
				expect(
					productElement.querySelector(".ProductItem-DetailsLink")
				).toBeDefined();
			});
		});
	});

	it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const item = await waitFor(() =>
			container.querySelector(".ProductItem")
		);

		if (item) {
			const link = item.querySelector(".ProductItem-DetailsLink");
			if (link) await userEvent.click(link);
		}

		await waitFor(() => {
			expect(screen.getByText(mockProducts[0].name));
			expect(screen.getByText(mockProducts[0].description));
			expect(screen.getByText("$" + mockProducts[0].price));
			expect(screen.getByText(mockProducts[0].color));
			expect(screen.getByText(mockProducts[0].material));
			expect(screen.getByRole("button", { name: "Add to Cart" }));
		});
	});

	it("Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const item = await waitFor(() =>
			container.querySelector(".ProductItem")
		);

		if (item) {
			const link = item.querySelector(".ProductItem-DetailsLink");
			if (link) await userEvent.click(link);
		}

		const btn = screen.getByRole("button", { name: "Add to Cart" });
		await userEvent.click(btn);

		await waitFor(() => {
			expect(screen.getByText("Item in cart"));
		});

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		await waitFor(() => {
			expect(screen.getByText("Item in cart"));
		});
	});

	it('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const item = await waitFor(() =>
			container.querySelector(".ProductItem")
		);

		if (item) {
			const link = item.querySelector(".ProductItem-DetailsLink");
			if (link) await userEvent.click(link);
		}

		const btn = screen.getByRole("button", { name: "Add to Cart" });
		await userEvent.click(btn);
		await userEvent.click(btn);
		await userEvent.click(btn);

		await userEvent.click(screen.getByRole("link", { name: "Cart (1)" }));

		await waitFor(() => {
			expect(screen.getByText("3"));
		});
	});

	it("содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
		const { container } = render(
			createApplication(new MockApi(BASE_NAME), new MockCartApi())
		);

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		const item = await waitFor(() =>
			container.querySelector(".ProductItem")
		);

		if (item) {
			const link = item.querySelector(".ProductItem-DetailsLink");
			if (link) await userEvent.click(link);
		}

		const btn = screen.getByRole("button", { name: "Add to Cart" });
		await userEvent.click(btn);
		await userEvent.click(btn);

		await userEvent.click(screen.getByRole("link", { name: "Cart (1)" }));

		await waitFor(() => {
			expect(screen.getByText("2"));
		});

		await userEvent.click(screen.getByRole("link", { name: "Catalog" }));

		await userEvent.click(screen.getByRole("link", { name: "Cart (1)" }));

		await waitFor(() => {
			expect(screen.getByText("2"));
		});
	});
});
