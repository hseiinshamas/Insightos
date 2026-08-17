# InsightOS

### AI-Powered Business Intelligence & Automated Data Analysis Platform

InsightOS is a full-stack business intelligence application that transforms raw CSV datasets into actionable business insights.

Users can upload a sales dataset and automatically receive:

- Business KPIs
- Revenue analysis
- Product performance analysis
- Regional performance analysis
- Data quality profiling
- Automated business insights
- Risk and anomaly detection
- Executive summaries
- Business opportunities
- Recommended actions
- Interactive visualizations

The goal of InsightOS is to bridge the gap between **raw data and business decisions**.

Instead of requiring a user to manually clean, analyze, visualize, and interpret a dataset, InsightOS performs these steps automatically through a data analytics engine and presents the results through a modern web dashboard.

---

# Demo

> Upload a CSV → InsightOS analyzes the dataset → the dashboard generates KPIs, charts, anomalies, insights, and recommendations.

Example workflow:

```text
Sales CSV
   ↓
Data Upload
   ↓
Data Profiling
   ↓
KPI Calculation
   ↓
Product & Regional Analytics
   ↓
Anomaly Detection
   ↓
Business Interpretation
   ↓
Interactive Dashboard
```

---

# Why InsightOS?

Traditional data analysis often requires multiple steps:

1. Load the dataset
2. Inspect the data
3. Clean the data
4. Calculate metrics
5. Group and aggregate information
6. Create visualizations
7. Search for unusual patterns
8. Interpret the results
9. Decide what actions should be taken

InsightOS combines these steps into a single workflow.

The platform is designed to answer three fundamental business questions:

### 1. What happened?

Through KPIs and visualizations.

### 2. What looks unusual?

Through automated anomaly and risk detection.

### 3. What should the business do?

Through automated business interpretation and recommendations.

---

# Features

## 1. CSV Upload

Users can upload a CSV sales dataset directly through the web interface.

The frontend sends the file to the FastAPI backend using a multipart HTTP request.

Example:

```text
User
 ↓
Select CSV
 ↓
Analyze Dataset
 ↓
POST /analyze
 ↓
FastAPI
```

---

# 2. Dataset Profiling

InsightOS automatically analyzes the structure of the uploaded dataset.

The profiling engine calculates:

- Number of rows
- Number of columns
- Column names
- Missing values
- Numeric columns
- Categorical columns

Example output:

```json
{
  "rows": 1000,
  "columns": 7,
  "missing_values": 0,
  "numeric_columns": [
    "price",
    "quantity"
  ],
  "categorical_columns": [
    "product",
    "region"
  ]
}
```

This provides an immediate overview of the dataset before deeper analysis.

---

# 3. Business KPI Engine

InsightOS automatically calculates important business metrics.

Current KPIs include:

### Total Revenue

Calculated as:

```text
Revenue = Price × Quantity
```

Then:

```text
Total Revenue = Σ(Price × Quantity)
```

### Units Sold

```text
Units Sold = Σ Quantity
```

### Average Order Value

The current implementation calculates:

```text
Average Order Value =
Total Revenue / Number of Records
```

### Orders

The current implementation treats each dataset row as an order.

### Top Product

The product with the highest total unit volume.

### Top Region

The region with the highest total unit volume.

---

# 4. Product Performance Analytics

InsightOS groups sales data by product.

For every product it calculates:

- Revenue
- Units sold

The products are sorted by revenue.

Example:

```text
Product       Revenue       Units
---------------------------------
Laptop        €3,600        12
Keyboard      €1,100        20
Mouse         €150          50
```

This allows the dashboard to identify the products contributing most to business revenue.

---

# 5. Regional Performance Analytics

The same analytical process is applied to geographic regions.

Example:

```text
Region        Revenue       Units
---------------------------------
Rome          €2,525        35
Milan         €1,500        20
Naples        €835          15
```

This helps identify geographic concentration and market performance.

---

# 6. Automated Business Insights

InsightOS automatically converts analytical results into business-readable statements.

Instead of displaying only:

```text
Laptop → €3,600
```

the system generates:

```text
Laptop is the strongest revenue driver,
generating €3,600 and contributing 74.1%
of total revenue.
```

The system can identify:

- Strongest revenue-generating product
- Strongest region
- Revenue concentration
- High-volume / low-revenue products
- Regional dependency
- Missing data

This turns raw analytics into business context.

---

# 7. Risk & Anomaly Detection

InsightOS contains a separate anomaly detection engine.

The engine looks for unusual business patterns without requiring time-series data.

Current detection methods include:

### Product Revenue Outliers

A product can be flagged if its revenue is significantly higher than the median product revenue.

The current threshold is:

```text
Product Revenue / Median Revenue >= 3
```

### Product Revenue Concentration

The system calculates the percentage of revenue generated by the top two products.

If:

```text
Top 2 Revenue Share >= 80%
```

the system flags a high product concentration risk.

Example:

```text
Top two products account for 92.6%
of total revenue.
```

### Volume / Revenue Mismatch

The system identifies products that have very high unit volume but contribute relatively little revenue.

This can indicate:

- Low pricing
- Low-value products
- Upselling opportunities
- Product mix issues

### Regional Concentration

If one region generates at least 50% of total revenue, InsightOS flags it as a potential regional dependency.

Example:

```text
Rome generates 52% of total revenue.
```

### Regional Outliers

Regions are compared against median regional revenue.

A region generating at least three times the median can be flagged as a regional performance outlier.

---

# 8. Business Analyst Engine

InsightOS contains an interpretation layer that transforms the outputs of the analytics and anomaly engines into a structured business report.

The analyst engine produces:

- Executive Summary
- Strengths
- Risks
- Opportunities
- Recommended Actions

Example:

```text
Executive Summary

The business generated €4,860 in total revenue
across 10 orders. Laptop is the strongest
revenue-generating product.

Risks

The top two products generate 92.6% of total
revenue.

Opportunities

Mouse has strong unit volume but contributes
relatively little revenue.

Recommended Action

Investigate pricing, bundling and upselling
opportunities for high-volume but lower-value
products.
```

---

# 9. Interactive Dashboard

The frontend is built with Next.js and provides a modern analytics dashboard.

The dashboard contains:

### KPI Cards

- Revenue
- Orders
- Units Sold
- Average Order Value

### Interactive Charts

- Revenue by Product
- Revenue by Region

### Performance Sections

- Product Performance
- Regional Performance

### Risk Detection

- Risks & Anomalies

### Business Interpretation

- AI Analyst
- Executive Summary
- Strengths
- Risks
- Opportunities
- Recommended Actions

### Key Insights

Automatically generated business observations.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Plotly.js

## Backend

- Python
- FastAPI
- Pandas

## Data Analysis

- Pandas
- Statistical/business rule-based analysis

## Development Tools

- Git
- GitHub
- VS Code

---

# System Architecture

```text
                         USER
                           │
                           ▼
                    Next.js Frontend
                           │
                           │ HTTP POST
                           ▼
                     FastAPI Backend
                           │
                           ▼
                    CSV → Pandas
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         Profiling       KPIs       Analytics
             │             │             │
             │             │       ┌─────┴─────┐
             │             │       ▼           ▼
             │             │   Products     Regions
             │             │
             └─────────────┼─────────────┘
                           ▼
                  Anomaly Detection
                           │
                           ▼
                   Analyst Engine
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Risks       Opportunities   Actions
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    JSON Response
                           │
                           ▼
                    Next.js Dashboard
                           │
                           ▼
                    Business User
```

---

# Backend Architecture

The backend is intentionally separated into analytical components.

Example structure:

```text
backend/
│
├── main.py
│
├── kpis.py
│
├── profiling.py
│
├── analytics.py
│
├── anomaly_detection.py
│
└── ai_analysis.py
```

Each module has a specific responsibility.

### `main.py`

Responsible for:

- FastAPI application
- API routes
- File uploads
- Connecting the analytical modules

### `profiling.py`

Responsible for:

- Dataset structure
- Missing values
- Column types

### `kpis.py`

Responsible for:

- Revenue
- Units sold
- Orders
- Average order value
- Top products
- Top regions

### `analytics.py`

Responsible for:

- Product analysis
- Regional analysis
- Business insights

### `anomaly_detection.py`

Responsible for:

- Revenue outliers
- Concentration risks
- Volume/revenue mismatches
- Regional dependencies
- Regional outliers

### `ai_analysis.py`

Responsible for:

- Executive summaries
- Strengths
- Risks
- Opportunities
- Recommendations

---

# API

## POST `/analyze`

Uploads and analyzes a CSV dataset.

### Request

```text
POST /analyze
Content-Type: multipart/form-data
```

The uploaded file is sent using the field:

```text
file
```

### Response

The API returns:

```json
{
  "filename": "...",

  "profile": {},

  "kpis": {},

  "analytics": {},

  "anomalies": {},

  "ai_analysis": {}
}
```

---

# Example Analysis

For a sample sales dataset, InsightOS may discover:

```text
Revenue:
€4,860

Top Product:
Laptop

Top Region:
Rome
```

Business insights:

```text
Laptop generated €3,600 and contributed
74.1% of total revenue.

Rome generated €2,525 and contributed
52.0% of total revenue.

The top two products accounted for
92.6% of total revenue.

Mouse had the highest unit volume but
contributed only 3.1% of revenue.
```

Risk detection:

```text
High Product Concentration

Regional Dependency
```

The system then generates recommended actions based on these findings.

---

# Design Philosophy

InsightOS follows several principles.

## Data First

The analytical engine calculates the facts before the interpretation layer generates conclusions.

## Explainability

Business conclusions should be traceable back to measurable statistics.

## Automation

The user should not need to manually calculate metrics or search for patterns.

## Actionability

The goal isn't simply to visualize data.

The goal is to help users understand:

```text
What happened?
Why does it matter?
What should I do?
```

## Zero-Cost Development

The project is being developed using free and open-source technologies.

The current architecture does not require:

- Paid APIs
- Paid AI services
- Paid databases
- Paid cloud services

---

# Current Limitations

InsightOS is currently optimized for sales-style datasets containing fields such as:

```text
product
price
quantity
region
```

The current implementation assumes:

- Each row represents an order/transaction
- Revenue can be calculated from `price × quantity`
- There is no requirement for a date column
- Time-series anomaly detection is not yet implemented

The system can be expanded to support more generalized datasets in future versions.

---

# Roadmap

## Phase 1 — Core Analytics

- [x] CSV upload
- [x] Dataset profiling
- [x] KPI calculation
- [x] Product analytics
- [x] Regional analytics
- [x] Interactive charts
- [x] Automated business insights

## Phase 2 — Intelligence

- [x] Product anomaly detection
- [x] Revenue concentration detection
- [x] Regional dependency detection
- [x] Volume/revenue mismatch detection
- [x] Executive summaries
- [x] Business recommendations

## Phase 3 — AI Analyst

- [ ] Local open-source language model
- [ ] Natural language questions
- [ ] Dataset-aware AI answers
- [ ] Explainable AI responses
- [ ] AI-generated recommendations

## Phase 4 — Advanced Analytics

- [ ] Time-series analysis
- [ ] Forecasting
- [ ] Customer segmentation
- [ ] Customer lifetime value
- [ ] Churn analysis
- [ ] Profitability analysis
- [ ] Correlation analysis
- [ ] Statistical anomaly detection

## Phase 5 — Productization

- [ ] Dataset history
- [ ] Exportable reports
- [ ] PDF business reports
- [ ] Dashboard filters
- [ ] Natural-language analytics
- [ ] Multi-dataset support
- [ ] User accounts
- [ ] Deployment

---

# Future Vision

InsightOS is intended to evolve from an automated dashboard into an AI-powered business analyst.

The long-term workflow is:

```text
Upload Data
     ↓
Understand Data
     ↓
Analyze Performance
     ↓
Detect Problems
     ↓
Explain Problems
     ↓
Answer Questions
     ↓
Recommend Actions
     ↓
Predict Future Outcomes
```

The ultimate goal is to make sophisticated data analysis accessible to users who may not know SQL, Python, Pandas, or statistics.

---

# What This Project Demonstrates

InsightOS demonstrates practical skills across multiple areas:

### Data Analytics

- Data profiling
- Aggregation
- KPI design
- Business metrics
- Statistical reasoning
- Anomaly detection
- Business interpretation

### Data Engineering

- Data ingestion
- Structured analytical pipelines
- Modular Python architecture
- JSON-based API responses

### Backend Development

- FastAPI
- REST APIs
- File uploads
- Data processing

### Frontend Development

- Next.js
- React
- TypeScript
- Tailwind CSS
- Interactive data visualization

### AI Engineering

The project architecture is designed to integrate a local AI model that can reason over structured analytical results without requiring paid external APIs.

---

# Author

**Hussein Shamas**

Master's Student in Data Science

Interested in:

- Data Science
- Artificial Intelligence
- Machine Learning
- Data Analytics
- AI Engineering
- Full-Stack Development

---

# License

This project is currently intended as a personal portfolio and learning project.
