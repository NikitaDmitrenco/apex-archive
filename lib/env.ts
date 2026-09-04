import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine(
      (value) =>
        value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a postgres:// connection string",
    ),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  /**
   * Supabase project URL and public anon key — both optional so the build does not crash
   * when the project has not been provisioned for Auth yet. The auth-related code paths
   * check for their presence at use time and degrade gracefully when missing.
   */
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  /**
   * Server-only service-role key, never exposed to the browser. Unused for now; declared
   * so .env.example documents the variable without a separate code path.
   */
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  /**
   * Optional. Required only by the AI Archive Assistant route at request time; without it
   * the route responds 503 and the rest of the app is unaffected.
   */
  OPENAI_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Validates server environment variables the first time they are needed. Parsing lazily
 * rather than at import keeps routes that touch no database buildable without credentials.
 */
export function serverEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment variables:\n${problems}\n\nCopy .env.example to .env.local and fill it in.`,
    );
  }

  cached = parsed.data;
  return cached;
}
