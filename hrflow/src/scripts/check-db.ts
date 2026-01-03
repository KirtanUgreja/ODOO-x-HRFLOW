
import { db } from "@/lib/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"

async function main() {
    try {
        console.log("Attempting to fetch profile...")
        const id = "2637149f-dba5-4b70-a468-aa6719f1ad2d"
        const result = await db.select().from(profiles).where(eq(profiles.id, id))
        console.log("Success:", result)
    } catch (error) {
        console.error("Full Error Object:", JSON.stringify(error, null, 2))
        console.error("Error Message:", error)
    }
}

main()
