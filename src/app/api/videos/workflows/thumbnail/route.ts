import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const utApi = new UTApi();
  const input = context.requestPayload as InputType;
  const { userId, videoId, prompt } = input;

  // get existing video from database
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    console.log("existingVideo", existingVideo);

    return existingVideo;
  });

  // generate thumbnail using Gemini AI
  const result = await context.run("generate-thumbnail", async () => {
    const resp = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.DEEPAI_API_KEY!,
      },
      body: JSON.stringify({
        text: prompt,
      }),
    });

    const data = await resp.json();
    console.log("ai generated image", data);
  });

  const tempThumbnailUrl = "";

  if (!tempThumbnailUrl) {
    throw new Error("Bad request");
  }

  // cleanup old thumbnail
  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utApi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({ thumbnailKey: null, thumbnailUrl: null })
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    }
  });

  // upload thumbnail to uploadThing
  const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
    const { data } = await utApi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!data) {
      throw new Error("Bad request");
    }

    return data;
  });

  // update thumbnailUrl in database
  await context.run("update-to-db", async () => {
    await db
      .update(videos)
      .set({
        thumbnailUrl: uploadedThumbnail.ufsUrl,
        thumbnailKey: uploadedThumbnail.key,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
