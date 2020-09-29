import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshot } from "./_lib/chromuim";
import getThumbnailTemplate from "./_lib/thumbTemplate";

const isDev = !process.env.AWS_REGION;

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const title = String(request.query.title);

    if (!title) {
      throw new Error("Title is required");
    }

    const html = getThumbnailTemplate(title);

    const file = await getScreenshot(html, isDev);

    response.setHeader("Content-Type", "image/png");
    response.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    );
    return response.end(file);
  } catch (err) {
    console.error(err);

    return response.status(500).send("Internal server error");
  }
}
