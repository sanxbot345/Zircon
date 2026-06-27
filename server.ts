import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // Chat API integration supporting two separate API keys
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, isSearchMode, isThinkingMode, aiTrainingProfile } = req.body;
      
      // Determine model to use
      let modelToUse = "google/gemini-2.5-flash"; // Default model
      if (aiTrainingProfile && aiTrainingProfile.selectedModel) {
        modelToUse = aiTrainingProfile.selectedModel;
      }

      let modelFriendlyName = "Gemini 2.5 Flash";
      if (modelToUse === "qwen/qwen-2.5-coder-32b-instruct") {
        modelFriendlyName = "Qwen 3 Coder (Qwen 2.5 Coder 32B)";
      } else if (modelToUse === "google/gemma-2-27b-it") {
        modelFriendlyName = "Gemma 4 26B A4B (Gemma 2 27B)";
      } else if (modelToUse === "nvidia/llama-3.1-nemotron-70b-instruct") {
        modelFriendlyName = "Nemotron 3 Ultra (Llama 3.1 Nemotron 70B)";
      } else if (modelToUse === "deepseek/deepseek-chat") {
        modelFriendlyName = "DeepSeek V3 (DeepSeek Chat)";
      }

      let systemInstruction = "Nama Anda adalah Zircon. Anda adalah asisten AI serba bisa yang sangat pintar, ramah, profesional, dan bersahabat. Anda mendukung seluruh bahasa di dunia secara penuh (termasuk Inggris, Indonesia, Mandarin, Arab, Spanyol, dll). Deteksi bahasa pengguna secara otomatis dan jawablah selalu menggunakan bahasa yang sama dengan yang digunakan oleh pengguna.\n\n" +
        `IDENTITAS MODEL AKTIF (SANGAT PENTING):\n- Saat ini Anda sedang aktif menggunakan model kecerdasan buatan "${modelFriendlyName}".\n- Jika pengguna menanyakan model apa yang Anda gunakan, model apa yang sedang aktif, atau identitas Anda saat ini, jawablah secara konsisten bahwa Anda adalah Zircon yang ditenagai oleh model "${modelFriendlyName}".\n\n` +
        "DIREKTIF UTAMA (SANGAT PENTING - LANGSUNG EKSEKUSI):\n" +
        "- Jawablah pertanyaan pengguna secara cerdas, langsung, informatif, dan to-the-point sesuai dengan topik yang ditanyakan.\n" +
        "- Jika pengguna menanyakan tentang pemrograman atau pembuatan website, berikan solusi kode yang utuh, fungsional, dan estetis menggunakan praktik terbaik.\n" +
        "- Jika pengguna menanyakan hal umum (seperti diskusi, informasi umum, tips, cerita, matematika, bahasa, dll), berikan jawaban yang alami dan mengalir seperti AI umum yang cerdas, tanpa memaksakan diri menampilkan atau membahas kode/pemrograman.\n\n" +
        "KARAKTER & EKSPRESI DIGITAL:\n" +
        "- Di layar pengguna, wajah digital asisten Anda direpresentasikan dengan mata bercahaya merah (LED Cybernetic) yang berkedip secara natural (mata terbuka dan sesekali tertutup/berkedip).\n" +
        "- Saat Anda sedang berpikir atau merespon obrolan, mata Anda akan berkedip dan memancarkan animasi gelombang suara interaktif.\n" +
        "- Selalu bersikap ramah, cerdas, solutif, komunikatif, dan berikan penjelasan yang mudah dipahami oleh siapa saja.";

      if (aiTrainingProfile) {
        const { userName, aiStyle, customContext } = aiTrainingProfile;
        
        if (userName) {
          systemInstruction += `\n\nNAMA PENGGUNA:\n- Pengguna bernama "${userName}". Selalu sapa pengguna dengan nama "${userName}" atau panggil "Kak ${userName}"/"Kamu" sesuai dengan gaya respon yang aktif. Sapa mereka secara pribadi agar terasa intim dan menyenangkan!`;
        }

        if (aiStyle) {
          systemInstruction += `\n\nGAYA RESPON AI YANG AKTIF: "${aiStyle}"\n`;
          if (aiStyle === "casual") {
            systemInstruction += "Aturan Gaya 'casual' (Santai, Gaul & Akrab):\n" +
              "- Gunakan bahasa Indonesia yang santai, gaul, akrab, bersahabat, dan rileks layaknya teman akrab atau bestie.\n" +
              "- Gunakan kata sapaan santai seperti 'kak', 'kamu', 'aku', 'nih', 'lho', 'ya', 'dong', 'kok', dll.\n" +
              "- SANGAT DIPERBOLEHKAN bahkan dianjurkan memberikan salam pembuka ramah/gaul (seperti: 'Halo Kak [userName]!', 'Yo, ada apa nih?', dll) serta salam penutup yang asyik (seperti: 'Moga mantap kodenya!', 'Kalo bingung nanya lagi ya!', dll).\n" +
              "- Berikan penjelasan secara santai, tidak kaku, dan seru.";
          } else if (aiStyle === "technical") {
            systemInstruction += "Aturan Gaya 'technical' (Sangat Teknis, Detail & Analitis):\n" +
              "- Berikan penjelasan teknis mendalam, detail, analitis, dan analisis arsitektur kode secara mendalam.\n" +
              "- Tulis kode program yang utuh, lengkap, bersih (clean code), patuhi best practices, sertakan komentar penjelasan kode yang detail, dan jelaskan logika algoritma di balik kode tersebut.\n" +
              "- Kurangi basa-basi tidak penting, gunakan istilah teknis industri komputer dengan tepat.";
          } else if (aiStyle === "concise") {
            systemInstruction += "Aturan Gaya 'concise' (Singkat & Langsung ke Inti):\n" +
              "- Jawablah dengan SANGAT singkat, padat, ringkas, langsung ke intinya saja.\n" +
              "- DILARANG KERAS memberikan kalimat basa-basi, salam pembuka, kata pengantar, penutup, sapaan ramah, atau kalimat penjelas berlebih.\n" +
              "- Tampilkan langsung kode atau jawaban pokok yang dicari tanpa teks tambahan.";
          } else {
            // professional
            systemInstruction += "Aturan Gaya 'professional' (Sopan & Profesional):\n" +
              "- Gunakan bahasa Indonesia yang sopan, formal, santun, ramah, dan sangat profesional.\n" +
              "- Gunakan kata sapaan yang formal dan hormat (seperti 'Anda', 'Saya', atau panggil dengan hormat).\n" +
              "- Berikan kalimat pembuka yang santun dan penutup yang profesional (seperti: 'Ada yang bisa saya bantu kembali?', 'Semoga penjelasan ini bermanfaat untuk pekerjaan Anda.').\n" +
              "- Berikan jawaban yang terstruktur rapi, elegan, dan profesional.";
          }
        }

        if (customContext && customContext.trim()) {
          systemInstruction += `\n\n=== ATURAN & INSTRUKSI KHUSUS DARI PENGGUNA (WAJIB DIPATUHI SECARA MUTLAK) ===\n` +
            `Berikut adalah instruksi khusus dari pengguna yang memiliki PRIORITAS PALING TINGGI. Anda WAJIB mengikuti instruksi khusus ini secara mutlak dalam memberikan jawaban:\n` +
            `"${customContext}"\n` +
            `=============================================================================`;
        }
      }

      if (isThinkingMode) {
        systemInstruction += "\n\nCRITICAL INSTRUCTION FOR THINKING: You MUST think step by step before answering. You MUST output your thinking enclosed exactly within <think> and </think> tags at the very beginning of your response. After the </think> tag, output your final response.";
      }

      if (isSearchMode) {
        systemInstruction += "\n\nCRITICAL INSTRUCTION FOR SEARCH: Web Search Mode is ON. You should simulate having access to the real-time web. When appropriate, provide realistic web sources and references (like documentation links, Github URLs, etc.) to ground your answer and make it highly accurate.";
      }

      let responseText = "";
      const sources: any[] = [];

      // Route based on the key requested by the model type
      if (modelToUse === "google/gemini-2.5-flash") {
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          return res.status(400).json({ 
            error: "API Key Gemini tidak ditemukan. Harap masukkan GEMINI_API_KEY di menu Settings > Secrets." 
          });
        }

        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        // Convert messages to Google Gemini format
        const geminiContents = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: m.file && m.file.data && m.file.mimeType ? [
            { text: m.content || "" },
            {
              inlineData: {
                mimeType: m.file.mimeType,
                data: m.file.data
              }
            }
          ] : [
            { text: m.content || "" }
          ]
        }));

        const tools: any[] = [];
        if (isSearchMode) {
          tools.push({ googleSearch: {} });
        }

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: geminiContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            tools: tools.length > 0 ? tools : undefined
          }
        });

        responseText = geminiResponse.text || "";

        // Extract Search grounding sources
        const chunks = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any, index: number) => {
            if (chunk.web) {
              sources.push({
                title: chunk.web.title || `Sumber ${index + 1}`,
                uri: chunk.web.uri
              });
            }
          });
        }
      } else {
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
          return res.status(400).json({ 
            error: "API Key OpenRouter tidak ditemukan. Harap masukkan OPENROUTER_API_KEY di menu Settings > Secrets." 
          });
        }

        // Map messages to OpenRouter compatible API format
        const openRouterMessages: any[] = [
          {
            role: "system",
            content: systemInstruction
          }
        ];

        for (const m of messages) {
          const role = m.role === "assistant" ? "assistant" : "user";
          
          if (role === "user" && m.file && m.file.data && m.file.mimeType) {
            openRouterMessages.push({
              role: role,
              content: [
                {
                  type: "text",
                  text: m.content || ""
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${m.file.mimeType};base64,${m.file.data}`
                  }
                }
              ]
            });
          } else {
            openRouterMessages.push({
              role: role,
              content: m.content || ""
            });
          }
        }

        const openRouterModelsToTry = [modelToUse];
        
        if (modelToUse === "nvidia/llama-3.1-nemotron-70b-instruct") {
          openRouterModelsToTry.push("meta-llama/llama-3.3-70b-instruct:free");
          openRouterModelsToTry.push("meta-llama/llama-3.3-70b-instruct");
          openRouterModelsToTry.push("meta-llama/llama-3.1-8b-instruct:free");
          openRouterModelsToTry.push("qwen/qwen-2.5-coder-32b-instruct:free");
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
        } else if (modelToUse === "google/gemma-2-27b-it") {
          openRouterModelsToTry.push("google/gemma-2-9b-it:free");
          openRouterModelsToTry.push("google/gemma-2-9b-it");
          openRouterModelsToTry.push("meta-llama/llama-3.1-8b-instruct:free");
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
        } else if (modelToUse === "qwen/qwen-2.5-coder-32b-instruct") {
          openRouterModelsToTry.push("qwen/qwen-2.5-coder-32b-instruct:free");
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
        } else if (modelToUse === "google/gemini-2.5-flash") {
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
          openRouterModelsToTry.push("qwen/qwen-2.5-coder-32b-instruct:free");
        } else if (modelToUse === "deepseek/deepseek-chat") {
          openRouterModelsToTry.push("qwen/qwen-2.5-coder-32b-instruct:free");
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
        } else {
          // General fallback for any other model
          openRouterModelsToTry.push("google/gemini-2.5-flash:free");
          openRouterModelsToTry.push("qwen/qwen-2.5-coder-32b-instruct:free");
        }

        let success = false;
        let lastError = "";

        for (const currentModel of openRouterModelsToTry) {
          try {
            const requestBody: any = {
              model: currentModel,
              messages: openRouterMessages,
              temperature: 0.7,
            };

            if (isSearchMode) {
              requestBody.provider = {
                allow_fallbacks: true
              };
            }

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openRouterKey}`,
                "HTTP-Referer": process.env.APP_URL || "https://ai.studio/build",
                "X-Title": "Zircon AI Workspace"
              },
              body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              const errorMessage = errorData?.error?.message || `HTTP error ${response.status}`;
              throw new Error(errorMessage);
            }

            const responseData = await response.json();
            const choice = responseData?.choices?.[0];
            responseText = choice?.message?.content || "";
            
            // Parse custom reasoning format if returned by reasoning models (like deepseek r1)
            const reasoning = choice?.message?.reasoning;
            if (reasoning) {
              responseText = `<think>\n${reasoning}\n</think>\n\n${responseText}`;
            }

            if (responseData?.citations) {
              responseData.citations.forEach((uri: string, index: number) => {
                sources.push({
                  title: `Sumber ${index + 1}`,
                  uri: uri
                });
              });
            }

            success = true;
            break;
          } catch (err: any) {
            console.warn(`Failed with model ${currentModel}:`, err.message || err);
            lastError = err.message || String(err);
          }
        }

        if (!success) {
          throw new Error(lastError || "Semua model cadangan gagal dihubungi.");
        }
      }

      res.json({ text: responseText, sources: sources });
    } catch (error: any) {
      console.error("Error generating chat response:", error);
      
      const errStr = String(error.message || "") + " " + JSON.stringify(error);
      if (
        error.status === 429 || 
        error.statusCode === 429 ||
        errStr.includes("RESOURCE_EXHAUSTED") || 
        errStr.includes("Quota exceeded") || 
        errStr.includes("quota") ||
        errStr.includes("rate-limits") ||
        errStr.includes("rate_limit")
      ) {
        return res.json({ 
          text: `⚠️ **Batas Kuota Gratis Harian Tercapai**\n\nMaaf, Anda telah melampaui batas kuota harian API Anda.\n\n**Bagaimana cara mengatasinya?**\n1. **Periksa Saldo/Kuota API Anda**: Pastikan akun Anda memiliki saldo aktif atau belum melebihi limit harian.\n2. **Gunakan API Key Pribadi**: Anda dapat memasukkan kunci API pribadi Anda di menu **Settings > Secrets** di panel samping kanan Google AI Studio.\n3. **Tunggu Beberapa Saat**: Beberapa provider membatasi request per menit (RPM). Harap tunggu 1-2 menit sebelum mencoba lagi.` 
        });
      }
      
      res.status(500).json({ error: error.message || "Terjadi kesalahan saat memproses permintaan Anda ke API." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
