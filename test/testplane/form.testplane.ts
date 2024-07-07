import { fakerRU as faker } from "@faker-js/faker";
import { getPageUrl } from "./utils";

describe("Форма оформления заказа", () => {
	it("После отправления формы появляется сообщение с id нового заказа", async ({
		browser,
	}) => {
		await browser.url(getPageUrl("catalog/0"));
		const addToCartBtn = await browser.$(".ProductDetails-AddToCart");

		await addToCartBtn.click();
		await browser.url(getPageUrl("cart"));
		const orderForm = await browser.$(".Form");

		const inputName = await orderForm.$("input#f-name");
		await inputName.setValue(faker.person.fullName());
		const inputPhone = await orderForm.$("input#f-phone");
		await inputPhone.setValue("89133241212");
		const inputAddress = await orderForm.$("textarea#f-address");
		await inputAddress.setValue(faker.location.streetAddress());

		const sendBtn = await orderForm.$(".Form-Submit");
		await sendBtn.click();
		const successMessage = await browser.$(
			".Cart-SuccessMessage.alert-success"
		);
		await successMessage.waitForExist();
		const orderId = await browser.$(".Cart-Number");
		const orderIdText = await orderId.getText();

		expect(successMessage).toExist();
		expect(orderIdText).toEqual("1");
	});
});
