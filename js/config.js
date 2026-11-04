/* ============================================================
   smolchat site configuration — edit this file only.
   Nothing here is invented: null = not provided yet.
   ============================================================ */
window.SMOLCHAT_CONFIG = {
  siteUrl: null, // e.g. "https://smolchat.netlify.app" (also set the og:image URL in index.html)
  version: null, // e.g. "1.0.0"
  releaseDate: null,
  releaseNotesUrl: null,

  // To publish an installer: drop the file into the folder, then set `file`.
  // Optional: version, arch, size (e.g. "84 MB"), sha256.
  downloads: {
    windows: { label: "Windows", dir: "downloads/windows/", file: null, arch: null, size: null, version: null, sha256: null },
    macos:   { label: "macOS",   dir: "downloads/macos/",   file: null, arch: null, size: null, version: null, sha256: null }
  },

  // Screenshots (themes of the real app).
  screenshots: [
    { id: "ember",    label: "Ember",    src: "assets/images/chat-ember.webp",    alt: "smolchat chat window in the Ember theme" },
    { id: "graphite", label: "Graphite", src: "assets/images/chat-graphite.webp", alt: "smolchat chat window in the Graphite theme" },
    { id: "ocean",    label: "Ocean",    src: "assets/images/chat-ocean.webp",    alt: "smolchat chat window in the Ocean theme" }
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
    github: "https://github.com/smollabs/smolchat",
    docs: "#",    // TODO: documentation URL
    issues: "#",  // TODO: issue tracker URL
    license: "#", // TODO: license URL
    licenseName: "License (to be confirmed)"
  }
};
