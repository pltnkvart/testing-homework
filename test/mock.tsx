import { CartState, Product, ProductShortInfo } from "../src/common/types";
import { CartApi, ExampleApi } from "../src/client/api";
import { AxiosResponse } from "axios";
import { fakerRU as faker } from "@faker-js/faker";

const commerce = faker.commerce;

export const mockProducts: Product[] = Array.from(
	{ length: 5 },
	(_, index) => ({
		id: index,
		name: `${commerce.productAdjective()} ${commerce.product()}`,
		description: commerce.productDescription(),
		price: Number(commerce.price()),
		color: faker.color.human(),
		material: commerce.productMaterial(),
	})
);

export const mockProductsShortInfo: ProductShortInfo[] = mockProducts.map(
	({ id, name, price }) => ({ id, name, price })
);

export const mockCartData = {
	1: {
		name: mockProducts[0].name,
		price: mockProducts[0].price,
		count: 3,
	},
	2: {
		name: mockProducts[1].name,
		price: mockProducts[1].price,
		count: 1,
	},
};

export class MockApi extends ExampleApi {
	async getProducts(): Promise<AxiosResponse<ProductShortInfo[]>> {
		return Promise.resolve({
			data: mockProductsShortInfo,
			status: 200,
			statusText: "OK",
		} as AxiosResponse<ProductShortInfo[]>);
	}

	async getProductById(id: number): Promise<AxiosResponse<Product>> {
		return Promise.resolve({
			data: mockProducts[id],
			status: 200,
			statusText: "OK",
		} as AxiosResponse<Product>);
	}
}

export class MockCartApi extends CartApi {
	state = 0;

	getState(): CartState {
		return this.state > 0
			? {
					1: {
						name: mockProducts[0].name,
						price: mockProducts[0].price,
						count: 3,
					},
					2: {
						name: mockProducts[1].name,
						price: mockProducts[1].price,
						count: 1,
					},
			  }
			: {};
	}

	setState(state: CartState) {
		this.state += 1;
	}
}
