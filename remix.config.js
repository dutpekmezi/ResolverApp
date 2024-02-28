/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  browserNodeBuiltinsPolyfill: { 
    modules: { 
      querystring: true ,
      child_process: true,
      punycode: true,
      tls: true,
      net: true,
      assert: true,
      crypto: true,
      buffer: true,
      util: true,
      stream: true,
      zlib: true,
      events: true,
      https: true,
      http: true,
      path: true,
      os: true,
      fs: true,
      url: true
    } 
  }
};
