import { BASE_URL, getPageUrl } from "./utils";
import { ExampleApi } from "../../src/client/api";

const api = new ExampleApi(BASE_URL);

describe("Корзина", () => {
	it("Содержимое корзины сохраняется между перезагрузками страницы", async ({
		browser,
	}) => {
		await browser.url(getPageUrl("catalog/0"));
		const addToCartBtn = await browser.$(".ProductDetails-AddToCart");

		await addToCartBtn.click();
		await browser.url("/hw/store/cart");
		await browser.url("/hw/store/cart");
		const cartTable = await browser.$(".Cart-Table");
		await cartTable.waitForExist();

		expect(cartTable).toExist();
	});

	it("При добавлении товара в корзину, увеличивается индикатор количества товаров рядом со ссылкой на корзину", async ({
		browser,
	}) => {
		await browser.url(getPageUrl("catalog/0"));
		const addToCartBtn = await browser.$(".ProductDetails-AddToCart");

		await addToCartBtn.click();
		const cartLink1 = await browser.$('[href="/hw/store/cart"]');
		const cartLinkText1 = await cartLink1.getText();
		await browser.url("/hw/store/catalog/1");
		await addToCartBtn.click();
		const cartLink2 = await browser.$('[href="/hw/store/cart"]');
		const cartLinkText2 = await cartLink2.getText();

		expect(cartLinkText1).toEqual("Cart (1)");
		expect(cartLinkText2).toEqual("Cart (2)");
	});
});
