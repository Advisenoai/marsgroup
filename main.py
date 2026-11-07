from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

app = FastAPI(title="MarsGroup — Book Your Journey to Mars")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

MISSIONS = [
    {
        "id": 1,
        "name": "Red Horizon",
        "destination": "Olympus Mons Base",
        "duration": "9 months",
        "seats": 12,
        "price": "420,000",
        "tag": "Explorer",
    },
    {
        "id": 2,
        "name": "Dust & Dreams",
        "destination": "Valles Marineris Colony",
        "duration": "11 months",
        "seats": 8,
        "price": "680,000",
        "tag": "Pioneer",
    },
    {
        "id": 3,
        "name": "Crimson Veil",
        "destination": "Polar Ice Station",
        "duration": "14 months",
        "seats": 4,
        "price": "1,200,000",
        "tag": "Expedition",
    },
]

STATS = [
    {"label": "Missions Completed", "value": "47"},
    {"label": "Passengers Flown", "value": "312"},
    {"label": "km Covered", "value": "2.8B"},
    {"label": "Countries Represented", "value": "29"},
]


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "missions": MISSIONS,
            "stats": STATS,
        },
    )

