// Stub for supabase client
export const supabase = {
  storage: {
    from: (bucket: string) => ({
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://stub.supabase/${bucket}/${path}` },
      }),
      upload: async (
        path: string,
        _file: File,
        _opts?: Record<string, unknown>
      ) => ({
        data: { path: `${bucket}/${path}` },
        error: null,
      }),
    }),
  },
};
