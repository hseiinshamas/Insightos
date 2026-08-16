from fastapi import FastAPI, UploadFile, File
import pandas as pd
from io import BytesIO
from services.kpi_engine import calculate_kpis

from services.data_profiler import profile_dataframe


app = FastAPI(
    title="InsightOS API",
    description="AI-powered data analytics platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to InsightOS",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze_dataset(file: UploadFile = File(...)):

    contents = await file.read()

    df = pd.read_csv(BytesIO(contents))

    profile = profile_dataframe(df)
    kpis = calculate_kpis(df)

    return {
        "filename": file.filename,
        "profile": profile,
        "kpis": kpis
    }