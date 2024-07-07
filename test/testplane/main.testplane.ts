import { getPageUrl } from "./utils";

describe("Все страницы", () => {
	it("В магазине есть следующие страницы: главная, каталог, условия доставки, контакты и корзина", async ({
		browser,
	}) => {
		const pages = ["/", "catalog", "delivery", "contacts", "cart"];
		for (const page of pages) {
			await browser.url(getPageUrl(page));
			const title = await browser.$("title");
			expect(title).toExist();
		}
	});
});
