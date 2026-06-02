export const adultgenConfig = {
  backendUrl:
    import.meta.env.VITE_ADULTGEN_BACKEND_URL?.trim() ||
    'http://192.168.1.138:8080',
  model:
    import.meta.env.VITE_ADULTGEN_MODEL?.trim() ||
    'Qwen/Qwen3-4B-MLX-4bit',
  earlyAccessUrl:
    import.meta.env.VITE_EARLY_ACCESS_URL?.trim() ||
    'mailto:hello@adultgen.ai?subject=AdultGen%20AI%20Early%20Access',
};
