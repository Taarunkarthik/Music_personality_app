import { handlers } from "@/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
	try {
		console.log("Auth route GET url:", request.url)
	} catch (e) {
		console.error("Failed to log GET request url", e)
	}
	return handlers.GET(request as any)
}

export async function POST(request: Request) {
	try {
		console.log("Auth route POST url:", request.url)
	} catch (e) {
		console.error("Failed to log POST request url", e)
	}
	return handlers.POST(request as any)
}
