from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import whisperx
import torch
import tempfile
import requests
from pathlib import Path

app = FastAPI(title="WhisperX Transcription Service")

# Configuration
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
COMPUTE_TYPE = "float16" if DEVICE == "cuda" else "int8"

class TranscriptionRequest(BaseModel):
    audioUrl: str
    language: str = "en"
    enableDiarization: bool = True

class TranscriptionResponse(BaseModel):
    text: str
    segments: list
    language: str
    duration: float

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(request: TranscriptionRequest):
    """
    Transcribe audio using WhisperX with speaker diarization
    """
    try:
        # Download audio file
        response = requests.get(request.audioUrl)
        response.raise_for_status()
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            temp_audio.write(response.content)
            audio_path = temp_audio.name

        try:
            # Load WhisperX model
            model = whisperx.load_model(
                "large-v2", 
                DEVICE, 
                compute_type=COMPUTE_TYPE,
                language=request.language
            )
            
            # Transcribe
            audio = whisperx.load_audio(audio_path)
            result = model.transcribe(audio, batch_size=16)
            
            # Align timestamps
            model_a, metadata = whisperx.load_align_model(
                language_code=result["language"],
                device=DEVICE
            )
            result = whisperx.align(
                result["segments"],
                model_a,
                metadata,
                audio,
                DEVICE,
                return_char_alignments=False
            )
            
            # Speaker diarization (if enabled)
            if request.enableDiarization:
                diarize_model = whisperx.DiarizationPipeline(
                    use_auth_token="YOUR_HF_TOKEN",  # You'll need to set this
                    device=DEVICE
                )
                diarize_segments = diarize_model(audio)
                result = whisperx.assign_word_speakers(diarize_segments, result)
            
            # Extract full text
            full_text = " ".join([seg["text"] for seg in result["segments"]])
            
            # Calculate duration
            duration = result["segments"][-1]["end"] if result["segments"] else 0
            
            return TranscriptionResponse(
                text=full_text,
                segments=result["segments"],
                language=result.get("language", request.language),
                duration=duration
            )
            
        finally:
            # Clean up temp file
            Path(audio_path).unlink(missing_ok=True)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "device": DEVICE,
        "compute_type": COMPUTE_TYPE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

