import { useEffect, useMemo, useRef, useState } from "react";
import { getToken } from "../../utils/auth";

const API_BASE = "http://localhost:8080";

/** Formats HTML5 <video> can usually play in Chrome/Edge/Firefox/Safari */
const BROWSER_PLAYABLE_VIDEO_EXTS = ["mp4", "webm", "ogg", "ogv", "m4v"];
/** Common uploads that almost never play inside a browser player */
const BROWSER_UNSUPPORTED_VIDEO_EXTS = ["mkv", "avi", "wmv", "flv", "mpeg", "mpg", "ts"];

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

function looksLikeFileSystemPath(value) {
  return /^([a-zA-Z]:\\|\\\\|\/home\/|\/Users\/|\/var\/|\/tmp\/)/.test(
    value || ""
  );
}

function getExtension(name = "") {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)(?:\?|#|$)/);
  return match ? match[1] : "";
}

function getMaterialExtension(material) {
  return getExtension(
    material?.fileName || material?.fileUrl || material?.filePath || ""
  );
}

function isVideoMaterial(material) {
  const type = String(material?.fileType || "").toUpperCase();
  if (type === "VIDEO" || type.startsWith("VIDEO/")) return true;

  const ext = getMaterialExtension(material);
  return [
    ...BROWSER_PLAYABLE_VIDEO_EXTS,
    ...BROWSER_UNSUPPORTED_VIDEO_EXTS,
    "mov",
  ].includes(ext);
}

function isBrowserUnsupportedVideo(material) {
  return BROWSER_UNSUPPORTED_VIDEO_EXTS.includes(getMaterialExtension(material));
}

function guessMimeType(material) {
  const ext = getMaterialExtension(material);
  const map = {
    mp4: "video/mp4",
    m4v: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    ogv: "video/ogg",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    pdf: "application/pdf",
  };
  return map[ext] || (isVideoMaterial(material) ? "video/mp4" : undefined);
}

/** Fix spaces / unsafe chars in S3 and other media URLs */
function encodeMediaUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split("/")
      .map((segment) => {
        if (!segment) return segment;
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join("/");
    return parsed.toString();
  } catch {
    return String(url).replace(/ /g, "%20");
  }
}

function withAuthQuery(url) {
  const token = getToken();
  if (!token || !url) return url;

  // Only attach JWT to our own API — never to S3 / CDN URLs
  if (!url.startsWith(API_BASE)) return url;

  try {
    const parsed = new URL(url, API_BASE);
    if (
      !parsed.searchParams.has("token") &&
      !parsed.searchParams.has("access_token")
    ) {
      parsed.searchParams.set("token", token);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function buildCandidateUrls(material) {
  if (!material) return [];

  const rawValues = [
    material.fileUrl,
    material.url,
    material.filePath,
    material.path,
  ].filter(Boolean);

  const urls = [];

  rawValues.forEach((raw) => {
    const value = String(raw).trim();
    if (!value || looksLikeFileSystemPath(value)) return;

    if (isHttpUrl(value)) {
      urls.push(encodeMediaUrl(value));
      return;
    }

    if (value.startsWith("/")) {
      urls.push(encodeMediaUrl(`${API_BASE}${value}`));
      return;
    }

    urls.push(encodeMediaUrl(`${API_BASE}/${value.replace(/^\.?\//, "")}`));
  });

  return [...new Set(urls)];
}

export function resolveIsVideo(material) {
  return isVideoMaterial(material);
}

function UnsupportedVideoFallback({ material, mediaUrl }) {
  const ext = getMaterialExtension(material).toUpperCase() || "VIDEO";

  return (
    <div className="udemy-unsupported-video">
      <div className="udemy-unsupported-icon" aria-hidden="true">
        ▶
      </div>
      <h3>This {ext} file can’t play in the browser</h3>
      <p>
        Chrome, Edge, Firefox, and Safari don’t support <strong>.{ext.toLowerCase()}</strong>{" "}
        inside the course player. Re-upload this lecture as <strong>MP4 (H.264)</strong> to
        play it here — same as Udemy / YouTube.
      </p>
      <p className="udemy-unsupported-file">{material?.fileName}</p>
      <div className="udemy-unsupported-actions">
        {mediaUrl && (
          <>
            <a
              className="udemy-unsupported-btn primary"
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open / download video
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function CourseMediaPlayer({ material }) {
  const candidates = useMemo(() => buildCandidateUrls(material), [material]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const unsupported = isBrowserUnsupportedVideo(material);
  const primaryUrl = candidates[0] || "";
  const directUrl = candidates[candidateIndex]
    ? withAuthQuery(candidates[candidateIndex])
    : "";
  const mimeType = guessMimeType(material);

  useEffect(() => {
    setCandidateIndex(0);
    setError("");
  }, [material]);

  const handleMediaError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((index) => index + 1);
      return;
    }

    setError(
      "Could not play this video. Prefer MP4 (H.264). Check that the S3 file is public or the URL is valid."
    );
  };

  if (candidates.length === 0) {
    return (
      <div className="udemy-empty-stage">
        This lecture has no file URL from the server, so it cannot be played.
      </div>
    );
  }

  // MKV / AVI / etc. — browsers cannot decode these in <video>
  if (isVideoMaterial(material) && unsupported) {
    return (
      <UnsupportedVideoFallback material={material} mediaUrl={primaryUrl} />
    );
  }

  if (isVideoMaterial(material)) {
    return (
      <div className="udemy-media-player">
        <video
          ref={videoRef}
          key={directUrl}
          className="udemy-video"
          controls
          playsInline
          preload="metadata"
          onError={handleMediaError}
        >
          <source src={directUrl} type={mimeType} />
          Your browser does not support the video tag.
        </video>
        {error && <p className="udemy-media-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="udemy-media-player">
      <iframe
        key={directUrl}
        className="udemy-doc"
        src={directUrl}
        title={material?.fileName || "Document"}
      />
      {error && <p className="udemy-media-error">{error}</p>}
    </div>
  );
}
