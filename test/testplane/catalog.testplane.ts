import { BASE_URL, getPageUrl } from "./utils";
import { ExampleApi } from "../../src/client/api";

const api = new ExampleApi(BASE_URL);

describe("Каталог", async function () {
	it("Для товара в каталоге отображается название", async function ({
		browser,
	}) {
		await browser.url(getPageUrl("catalog"));

		const { data } = await api.getProducts();

		const products = await browser.$$(".ProductItem-Name");

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const productName = await product.getText();
			const productFromServer = data[i].name;

			expect(productName).toEqual(productFromServer);
		}
	});

	it("Для товара в каталоге отображается цена", async function ({ browser }) {
		await browser.url(getPageUrl("catalog"));

		const { data } = await api.getProducts();

		const products = await browser.$$(".ProductItem-Price");

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const productName = await product.getText();
			const productFromServer = data[i].price.toString();

			expect(productName).toEqual("$" + productFromServer);
		}
	});

	it("Для товара в каталоге отображается ссылка", async function ({
		browser,
	}) {
		await browser.url(getPageUrl("catalog"));

		const { data } = await api.getProducts();

		const products = await browser.$$(".ProductItem-DetailsLink");

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const productName = await product.getAttribute("href");
			const productFromServer = data[i].id.toString();

			expect(productName).toContain(productFromServer);
		}
	});

	it("Подробности о товаре отображаются верно", async function ({ browser }) {
		await browser.url(getPageUrl("catalog/1"));

		const { data } = await api.getProductById(1);

		const name = await browser.$(".ProductDetails-Name").getText();
		const description = await browser
			.$(".ProductDetails-Description")
			.getText();
		const price = await browser.$(".ProductDetails-Price").getText();
		const color = await browser.$(".ProductDetails-Color").getText();
		const material = await browser.$(".ProductDetails-Material").getText();

		expect(name).toEqual(data.name);
		expect(description).toEqual(data.description);
		expect(price).toEqual("$" + data.price);
		expect(color.toLowerCase()).toEqual(data.color.toLowerCase());
		expect(material.toLowerCase()).toEqual(data.material.toLowerCase());
	});
});
