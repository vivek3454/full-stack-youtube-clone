import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Please add MUX_WEBHOOK_SECRET to .env");
  }

  const headerPayload = await headers();
  const muxSignature = headerPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    SIGNING_SECRET
  );

  const eventType = payload.type as WebhookEvent["type"];

  if (eventType === "video.asset.created") {
    const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

    if (!data.upload_id) {
      return new Response("No upload id found", { status: 400 });
    }

    await db
      .update(videos)
      .set({
        muxAssetId: data.id,
        muxStatus: data.status,
      })
      .where(eq(videos.muxUploadId, data.upload_id));
  } else if (eventType === "video.asset.ready") {
    const data = payload.data as VideoAssetReadyWebhookEvent["data"];
    const playbackId = data.playback_ids?.[0].id;

    if (!data.upload_id) {
      return new Response("Missing upload ID", { status: 400 });
    }

    if (!playbackId) {
      return new Response("Missing playback ID", { status: 400 });
    }

    const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
    const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
    const duration = data.duration ? Math.round(data.duration * 1000) : 0;

    const utApi = new UTApi();
    const [uploadedThumbnail, uploadedPreview] = await utApi.uploadFilesFromUrl(
      [tempThumbnailUrl, tempPreviewUrl]
    );

    if (!uploadedThumbnail.data || !uploadedPreview.data) {
      return new Response("Faild to upload thumbnail and preview", {
        status: 500,
      });
    }

    const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;
    const { key: previewKey, ufsUrl: previewUrl } = uploadedPreview.data;

    await db
      .update(videos)
      .set({
        muxStatus: data.status,
        muxPlaybackId: playbackId,
        muxAssetId: data.id,
        thumbnailKey,
        thumbnailUrl,
        previewKey,
        previewUrl,
        duration,
      })
      .where(eq(videos.muxUploadId, data.upload_id));
  } else if (eventType === "video.asset.errored") {
    const data = payload.data as VideoAssetErroredWebhookEvent["data"];

    if (!data.upload_id) {
      return new Response("Missing upload ID", { status: 400 });
    }

    await db
      .update(videos)
      .set({
        muxStatus: data.status,
      })
      .where(eq(videos.muxUploadId, data.upload_id));
  } else if (eventType === "video.asset.deleted") {
    const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

    if (!data.upload_id) {
      return new Response("Missing upload ID", { status: 400 });
    }

    await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
  } else if (eventType === "video.asset.track.ready") {
    const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
      asset_id: string;
    };
    // Typescript incorrectly say asset_id does not exist
    const assetId = data.asset_id;
    const trackId = data.id;
    const status = data.status;

    if (!assetId) {
      return new Response("Missing asset ID", { status: 400 });
    }

    console.log("Track ready");

    await db
      .update(videos)
      .set({
        muxTrackId: trackId,
        muxTrackStatus: status,
      })
      .where(eq(videos.muxAssetId, assetId));
  }

  return new Response("Webhook received", { status: 200 });
}
