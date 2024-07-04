import { Home } from "../../src/client/pages/Home";
import { Delivery } from "../../src/client/pages/Delivery";
import { Contacts } from "../../src/client/pages/Contacts";

import { it, expect } from "@jest/globals";
import { render } from "@testing-library/react";

import React from "react";

describe("Проверка статических страниц", () => {
	it("Cтраницы главная, условия доставки, контакты должны иметь статическое содержимое", () => {
		const renderedMain = render(<Home />);
		const renderedContacts = render(<Contacts />);
		const renderedDelivery = render(<Delivery />);

		expect(renderedMain.container.outerHTML).toMatchSnapshot();
		expect(renderedDelivery.container.outerHTML).toMatchSnapshot();
		expect(renderedContacts.container.outerHTML).toMatchSnapshot();
	});
});
