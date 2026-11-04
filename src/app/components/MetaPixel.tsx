import { Suspense } from "react"
import MetaPageView from "./MetaPageView"

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  if (!pixelId || !/^\d+$/.test(pixelId)) return null

  return (
    <>
      <Suspense fallback={null}>
        <MetaPageView />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
