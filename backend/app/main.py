from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, contracts, search, summary, risk, analytics, drafts, tracking, notifications, system, workflow, versions

app = FastAPI(title="Contract Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contracts.router)
app.include_router(search.router)
app.include_router(summary.router)
app.include_router(risk.router)
app.include_router(risk.overview_router)
app.include_router(analytics.router)
app.include_router(drafts.router)
app.include_router(drafts.templates_router)
app.include_router(tracking.router)
app.include_router(tracking.upcoming_router)
app.include_router(notifications.router)
app.include_router(system.router)
app.include_router(workflow.router)
app.include_router(workflow.workflows_router)
app.include_router(versions.router)

