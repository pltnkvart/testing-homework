export const BASE_NAME = "/";
export const BASE_URL = "http://localhost:3000/hw/store";

export function getPageUrl(route: string) {
	const bug_id = process.env.BUG_ID;

	return `${BASE_URL + BASE_NAME}${route}${
		bug_id ? `?bug_id=${bug_id}` : ""
	}`;
}
