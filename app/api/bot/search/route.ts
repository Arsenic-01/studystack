import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";
import { hostedAt } from "@/data";
import { DATABASE_ID, db, NOTE_COLLECTION_ID } from "@/lib/appwrite";

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SEARCH_KEY! 
);
const index = searchClient.initIndex(process.env.ALGOLIA_INDEX_NAME!);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CHATBOT_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  try {
    const result = await index.search(query, { hitsPerPage: 3 });

    const botResults = await Promise.all(
      result.hits.map(async (hit: any) => {
        let finalLink = hit.url || hit.path;

        if (hit.type === "note" && hit.path.includes("noteId=")) {
          try {
            const noteId = hit.path.match(/noteId=([^#&]+)/)?.[1];

            if (noteId) {
              const noteDoc = await db.getDocument(
                DATABASE_ID!,
                NOTE_COLLECTION_ID!,
                noteId
              );
              finalLink = noteDoc.fileUrl;
            }
          } catch (dbError) {
            console.error(`Failed to fetch Drive link for Note ${hit.title}:`, dbError);
            // Fallback: If DB fails, send them to the UI path instead of breaking
            finalLink = `${hostedAt}${hit.path}`; 
          }
        } 
        else if (finalLink?.startsWith("/")) {
          finalLink = `${hostedAt}${finalLink}`;
        }

        return {
          title: hit.title,
          type: hit.type,
          context: hit.abbreviation || hit.code || "",
          link: finalLink,
        };
      })
    );

    return NextResponse.json({
      status: "success",
      results_found: botResults.length,
      data: botResults,
    });

  } catch (error) {
    console.error("Bot Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}