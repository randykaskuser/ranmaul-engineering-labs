import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // @ts-ignore
  dangerously: {
    disableSymlinks: true
  }
});
