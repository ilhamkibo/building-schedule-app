import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
    pi.registerProvider("sumopod", {
        name: "SumoPod",
        baseUrl: "https://ai.sumopod.com/v1",
        apiKey: "sk-GCjgcprf-MuPs6cDn-7L7Q",

        // ini penting:
        api: "openai-completions",

        // biar otomatis pakai header:
        authHeader: true,

        models: [
            {
                id: "nvidia/nemotron-3-nano-30b", // atau model yg kamu punya di sumopod
                name: "Nemotron 30B",
                reasoning: true,
                input: ["text"],
                cost: {
                    input: 0,
                    output: 0,
                    cacheRead: 0,
                    cacheWrite: 0,
                },
                contextWindow: 128000,
                maxTokens: 4096,
            },
            {
                id: "openai/gpt-oss-20b",
                name: "GPT OSS 20B",
                reasoning: true,
                input: ["text"],
                cost: {
                    input: 0,
                    output: 0,
                    cacheRead: 0,
                    cacheWrite: 0,
                },
                contextWindow: 128000,
                maxTokens: 4096,
            },
            {
                id: "qwen/qwen3-30b-a3b-instruct-2507",
                name: "Qwen 30B",
                reasoning: true,
                input: ["text"],
                cost: {
                    input: 0,
                    output: 0,
                    cacheRead: 0,
                    cacheWrite: 0,
                },
                contextWindow: 128000,
                maxTokens: 4096,
            },
            {
                id: "zai/glm-4.7-fp8",
                name: "GLM 4.7",
                reasoning: true,
                input: ["text"],
                cost: {
                    input: 0,
                    output: 0,
                    cacheRead: 0,
                    cacheWrite: 0,
                },
                contextWindow: 128000,
                maxTokens: 4096,
            },
        ],
    });
}