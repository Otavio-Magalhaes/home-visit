from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, dashboard, healthSituation, resident, users, visit
from app.api import residence

app = FastAPI(
    docs_url="/api/docs", 
    openapi_url="/api/openapi.json",
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], to para facilitar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health") # MUDANÇA
def health_check():
    return {"status": "ok", "message": "Backend is working on Vercel!"}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/dashboard")
app.include_router(healthSituation.router, prefix="/api/health-situation")
app.include_router(residence.router, prefix="/api/residence")
app.include_router(resident.router, prefix="/api/resident")
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(visit.router, prefix="/api/visit")