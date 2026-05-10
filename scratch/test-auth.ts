import { auth } from "../src/auth"

async function test() {
  try {
    console.log("Testing Auth.js initialization...")
    const result = await auth()
    console.log("Init successful:", result)
  } catch (error) {
    console.error("Auth Error:", error)
  }
}

test()
