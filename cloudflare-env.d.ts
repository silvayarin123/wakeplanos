declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ADMIN_EMAIL?: string;
    EDITOR_PASSWORD_CONFIG?: string;
    BUCKET?: R2Bucket;
  }
}
