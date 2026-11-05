/* ============================================================
   smolchat site configuration — edit this file only.
   Nothing here is invented: null = not provided yet.
   ============================================================ */
window.SMOLCHAT_CONFIG = {
  siteUrl: null, // e.g. "https://smolchat.netlify.app" (also set the og:image URL in index.html)
  version: null, // e.g. "1.0.0"
  releaseDate: null,
  releaseNotesUrl: null,

  // To publish a local installer: drop the file into the folder, then set `file`.
  // For a hosted installer, set `url` instead. Optional: version, arch, size
  // (e.g. "84 MB"), sha256.
  downloads: {
    windows: { label: "Windows", dir: "downloads/windows/", file: null, url: "https://github.com/smollabs/smolchat-website/releases/download/v1.0.0/smolchat.exe", arch: null, size: null, version: "1.0.0", sha256: null },
    macos:   { label: "macOS",   dir: "downloads/macos/",   file: null, url: "https://github.com/smollabs/smolchat-website/releases/download/v1.0.0/smolchat.dmg", arch: null, size: null, version: "1.0.0", sha256: null },
    android: { label: "Android", dir: "downloads/android/", file: null, url: "https://github.com/smollabs/smolchat-android/releases/download/v0.1.0/SmolChat.apk", arch: null, size: null, version: "0.1.0", sha256: "6c5a1ba4823b7ef8be8014c0a88b4190c4e43ea84103bfef61461ad9d3b2b214",
               releaseNotesUrl: "https://github.com/smollabs/smolchat-android/releases/tag/v0.1.0" }
  },

  // Screenshots (themes of the real app). `mobile` = the Android app in the same theme.
  screenshots: [
    { id: "ember",    label: "Ember",    src: "assets/images/chat-ember.webp", mobile: "assets/images/mobile-ember.jpg",    alt: "smolchat chat window in the Ember theme" },
    { id: "graphite", label: "Graphite", src: "assets/images/chat-graphite.webp", mobile: "assets/images/mobile-graphite.jpg", alt: "smolchat chat window in the Graphite theme" },
    { id: "ocean",    label: "Ocean",    src: "assets/images/chat-ocean.webp", mobile: "assets/images/mobile-ocean.jpg",    alt: "smolchat chat window in the Ocean theme" }
  ],

  // Models shown in the "Models" section. Sizes are parameter counts.
  // type: "text" | "vision" | "document". Set confirmed:false to show a
  // "Support to be confirmed" tag on a card.
  models: [
    { name: "SmolLM",     type: "text",     sizes: ["135M", "360M", "1.7B"], note: "Compact text-generation models.",        confirmed: true },
    { name: "SmolLM2",    type: "text",     sizes: ["135M", "360M", "1.7B"], note: "Second-generation compact text models.", confirmed: true },
    { name: "SmolLM3",    type: "text",     sizes: ["3B"],                   note: "Third-generation text model.",           confirmed: true },
    { name: "SmolVLM",    type: "vision",   sizes: ["256M", "500M", "2.2B"], note: "Vision-language models that read images and text.", confirmed: true },
    { name: "SmolVLM2",   type: "vision",   sizes: ["256M", "500M", "2.2B"], note: "Vision-language models for images and video.",      confirmed: true },
    { name: "SmolDocling", type: "document", sizes: ["256M"],                note: "Document understanding from page images.", confirmed: true },
    { name: "ColSmol",    type: "document", sizes: ["256M", "500M"],         note: "Visual document retrieval models.",      confirmed: true }
  ],

  links: {
    org: "https://github.com/smollabs",
    github: "https://github.com/smollabs",
    android: "https://github.com/smollabs/smolchat-android",
    docs: "#",    // TODO: documentation URL
    issues: "#",  // TODO: issue tracker URL
    license: "#", // TODO: license URL
    licenseName: "License (to be confirmed)"
  }
};
