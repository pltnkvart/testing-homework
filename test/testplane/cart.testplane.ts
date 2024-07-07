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
});
