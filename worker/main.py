import modal
import os
import requests
import subprocess
import asyncio
import edge_tts
from supabase import create_client, Client

# 1. Define the computing environment (FFmpeg is required)
image = modal.Image.debian_slim().apt_install("ffmpeg").pip_install("supabase", "edge-tts", "requests")
app = modal.App("ai-shorts-worker")

@app.function(image=image, secrets=[modal.Secret.from_name("ai-shorts-secrets")])
async def trigger_stitch(job_data):
    """
    This function:
    - Generates TTS audio from the script.
    - Downloads video clips from Hugging Face.
    - Stitches them together with FFmpeg.
    - Uploads the final video to Supabase.
    """
    video_id = job_data['videoId']
    scenes = job_data['scenes'] # List of video URLs
    full_script = job_data['script']
    
    supabase_url = os.environ["SUPABASE_URL"]
    supabase_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    supabase: Client = create_client(supabase_url, supabase_key)

    print(f"🚀 Starting assembly for Video ID: {video_id}")

    # STEP 1: Generate Free Voiceover (Edge-TTS)
    audio_path = "/tmp/voiceover.mp3"
    communicate = edge_tts.Communicate(full_script, "en-US-ChristopherNeural")
    await communicate.save(audio_path)
    print("✅ Voiceover generated.")

    # STEP 2: Download Video Clips
    clip_paths = []
    for i, scene_url in enumerate(scenes):
        path = f"/tmp/clip_{i}.mp4"
        response = requests.get(scene_url)
        with open(path, "wb") as f:
            f.write(response.content)
        clip_paths.append(path)
    print(f"✅ Downloaded {len(clip_paths)} clips.")

    # STEP 3: Stitch clips using FFmpeg
    # Create a list file for FFmpeg concat
    with open("/tmp/inputs.txt", "w") as f:
        for path in clip_paths:
            f.write(f"file '{path}'\n")

    output_video = "/tmp/final_output.mp4"
    # FFmpeg command: Concat videos and add the generated audio
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/inputs.txt",
        "-i", audio_path, "-c:v", "libx264", "-c:a", "aac", "-map", "0:v:0", "-map", "1:a:0",
        "-shortest", "-pix_fmt", "yuv420p", output_video
    ]
    subprocess.run(cmd, check=True)
    print("✅ FFmpeg stitching complete.")

    # STEP 4: Upload to Supabase Storage
    with open(output_video, "rb") as f:
        supabase.storage.from_("videos").upload(f"{video_id}.mp4", f)

    # STEP 5: Update Database Status
    public_url = supabase.storage.from_("videos").get_public_url(f"{video_id}.mp4")
    supabase.table("VideoJob").update({"status": "COMPLETED", "finalVideoUrl": public_url}).eq("id", video_id).execute()

    print(f"🎉 Process Finished! Video live at: {public_url}")
    return {"url": public_url}

# This allows Vercel to trigger this code via a Webhook
@app.function(image=image)
@modal.web_endpoint(method="POST")
async def start_assembly(data: dict):
    trigger_stitch.remote(data)
    return {"message": "Assembly Started"}