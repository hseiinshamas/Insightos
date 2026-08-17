from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
from services.kpi_engine import calculate_kpis
from services.analytics_engine import calculate_analytics 
from services.data_profiler import profile_dataframe
from services.anomaly_detection import detect_anomalies
from services.ai_analysis import generate_ai_analysis

app = FastAPI(
    title="InsightOS API",
    description="AI-powered data analytics platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    analytics = calculate_analytics(df)
    anomalies = detect_anomalies(df)
    ai_analysis = generate_ai_analysis(
        kpis,
        analytics,
        anomalies
    )

    return {
        "filename": file.filename,
        "profile": profile,
        "kpis": kpis,
        "analytics": analytics,
        "anomalies": anomalies,
         "ai_analysis": ai_analysis
    }