import { inngest } from "./client";
import { generateScript } from "@/lib/ai/script-gen";
import { triggerHFPool } from "@/lib/ai/hf-pool";
import { triggerModalStitch } from "@/lib/modal";

export const generateVideoWorkflow = inngest.createFunction(
  { id: "generate-video-workflow" },
  { event: "api/video.requested" },
  async ({ event, step }) => {
    const { prompt, videoId } = event.data;

    // STEP 1: Write the Script (FREE via Groq)
    const script = await step.run("generate-script", async () => {
      return await generateScript(prompt);
    });

    // STEP 2: Generate 12 Scenes in Parallel (FREE via HF Pool)
    const sceneResults = await Promise.all(
      script.scenes.map((scene, index) => 
        step.run(`generate-scene-${index}`, async () => {
          return await triggerHFPool(scene.visualPrompt);
        })
      )
    );

    // STEP 3: Stitch Video & Add Audio (FREE via Modal)
    const finalVideo = await step.run("assemble-video", async () => {
      return await triggerModalStitch({
        scenes: sceneResults,
        script: script.fullText,
        videoId: videoId
      });
    });

    return { status: "success", url: finalVideo.url };
  }
);