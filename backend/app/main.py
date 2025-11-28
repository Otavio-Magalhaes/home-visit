from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, healthSituation, resident, visit
from app.api import residence


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is up and running successfully!"}


app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(residence.router, prefix="/api/residence")
app.include_router(resident.router, prefix="/api/resident")
app.include_router(healthSituation.router, prefix="/api/health-situation")
app.include_router(visit.router, prefix="/api/visit")