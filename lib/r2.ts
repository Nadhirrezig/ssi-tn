import { createHash, createHmac } from "node:crypto"

const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const endpoint = process.env.R2_ENDPOINT


export const R2_BUCKET = process.env.R2_BUCKET;

const ALGORITHM = "AWS4-HMAC-SHA256"
const SERVICE = "s3"

const REGION = "auto"

const hmac = (key: Buffer | string, data: string) =>
  createHmac("sha256", key).update(data, "utf8").digest()
const sha256Hex = (data: string) => createHash("sha256").update(data, "utf8").digest("hex")

const encodeKey = (objectKey: string) =>
    objectKey.split("/").map(encodeURIComponent).join("/")

/**
 * Builds a short-lived presigned GET URL for an object in the bucket.
 *
 * Presigned rather than header-signed so the caller can hand the URL straight
 * to fetch — and so a failing URL can be reproduced with curl when debugging.
 *
 * @throws if the R2 credentials are missing from the environment
 */

export function presignR2GetUrl(objectKey: string, expiresInSeconds = 300): string {
  if (!accessKeyId || !secretAccessKey || !endpoint || !R2_BUCKET) {
    throw new Error(
      "R2 configuration is missing — expected R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT and R2_BUCKET in the environment."
    )
  }
  const { host, origin } = new URL(endpoint)

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "")
  const datestamp = amzDate.slice(0, 8)
  const scope = `${datestamp}/${REGION}/${SERVICE}/aws4_request`

  const query = new URLSearchParams({
    "X-Amz-Algorithm": ALGORITHM,
    "X-Amz-Credential": `${accessKeyId}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresInSeconds.toString(),
    "X-Amz-SignedHeaders": "host"
  })

  query.sort()

  const canonicalUri = `/${R2_BUCKET}/${encodeKey(objectKey)}`
  const canonicalRequest = [
    "GET",
    canonicalUri,
    query.toString(),
    `host:${host}`,
    "",
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n")


  const stringToSign = [ALGORITHM, amzDate, scope, sha256Hex(canonicalRequest)].join("\n")

  const kDate = hmac(`AWS4${secretAccessKey}`, datestamp)
  const kRegion = hmac(kDate, REGION)
  const kService = hmac(kRegion, SERVICE)
  const kSigning = hmac(kService, "aws4_request")
  const signature = createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex")

  return `${origin}${canonicalUri}?${query.toString()}&X-Amz-Signature=${signature}`



}   