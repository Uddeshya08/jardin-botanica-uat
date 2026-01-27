import { useEffect } from "react"

export default function InstagramEmbed2() {
  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      const script = document.createElement("script")
      script.src = "//www.instagram.com/embed.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        overflowX: "auto",
        padding: "16px 0",
      }}
    >
      <blockquote
        className="instagram-media"
        // data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/p/DH_yNCNtFdA/?utm_source=ig_embed&utm_campaign=loading"
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "99.375%",
          flex: "0 0 auto",
        }}
      >
        <div style={{ padding: "16px" }}></div>
      </blockquote>

      <blockquote
        className="instagram-media"
        // data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/p/C7UGEzSSwjB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "99.375%",
          flex: "0 0 auto",
        }}
      >
        <div style={{ padding: "16px" }}></div>
      </blockquote>

      <blockquote
        className="instagram-media"
        // data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/p/DCJaKbpS1yx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "99.375%",
          flex: "0 0 auto",
        }}
      >
        <div style={{ padding: "16px" }}></div>
      </blockquote>

      <blockquote
        className="instagram-media"
        // data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/p/C5IcT0gyy6C/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "3px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px",
          maxWidth: "440px",
          minWidth: "426px",
          padding: 0,
          width: "99.375%",
          flex: "0 0 auto",
        }}
      >
        <div style={{ padding: "16px" }}></div>
      </blockquote>
    </div>
  )
}
