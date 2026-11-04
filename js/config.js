/* ============================================================
   smolchat site configuration — edit this file only.
   Nothing here is invented: null = not provided yet.
   ============================================================ */
window.SMOLCHAT_CONFIG = {
  siteUrl: null, // e.g. "https://smolchat.netlify.app" (used for Open Graph if set)
  version: null, // e.g. "1.0.0"
  releaseDate: null,
  releaseNotesUrl: null,

  // To publish an installer: drop the file into the folder, then set `file`.
  // Optional: version, arch, size (e.g. "84 MB"), sha256.
  downloads: {
    windows: { label: "Windows", dir: "downloads/windows/", file: null, arch: null, size: null, version: null, sha256: null },
    macos:   { label: "macOS",   dir: "downloads/macos/",   file: null, arch: null, size: null, version: null, sha256: null }
  },

  video: { src: "assets/videos/demo.mp4", poster: "assets/videos/poster.webp" },

  // Screenshots (themes of the real app). Add model-manager shots here when ready.
  screenshots: [
    { id: "ember",    label: "Ember",    src: "assets/images/chat-ember.webp",    alt: "smolchat chat window in the Ember theme" },
    { id: "graphite", label: "Graphite", src: "assets/images/chat-graphite.webp", alt: "smolchat chat window in the Graphite theme" },
    { id: "ocean",    label: "Ocean",    src: "assets/images/chat-ocean.webp",    alt: "smolchat chat window in the Ocean theme" }
  ],
  extraShots: [
    { title: "Model library", src: null, alt: "smolchat model library" },
    { title: "Model download", src: null, alt: "smolchat downloading a model" }
  ],

  // Set confirmed:true ONLY for models the desktop app actually supports.
  models: [
    { name: "SmolLM",   note: "Compact text models",        confirmed: false },
    { name: "SmolLM2",  note: "Second-generation text models", confirmed: false },
    { name: "SmolLM3",  note: "Third-generation text models",  confirmed: false },
    { name: "SmolVLM",  note: "Vision-language models",     confirmed: false },
    { name: "SmolVLM2", note: "Image and video understanding", confirmed: false }
  ],

  // Leave empty until verified. Section stays hidden while empty.
  // Example: [{ label: "Operating system", value: "..." }]
  requirements: [],

  links: {
    org: "#", // TODO: smollabs organization URL
    github: "#", // TODO: smolchat repository URL
    docs: "#", // TODO: documentation URL
    issues: "#", // TODO: issue tracker URL
    license: "#", // TODO: license URL
    licenseName: "License (to be confirmed)"
  }
};
