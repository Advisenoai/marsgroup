from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

app = FastAPI(title="MarsGroup — Building Tomorrow, Today")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

PROJECTS = [
    {
        "id": 1,
        "name": "Skyline Residences",
        "type": "Residential Complex",
        "location": "Navi Mumbai, MH",
        "duration": "18 months",
        "unit_label": "Total Units",
        "units": "240 Apartments",
        "price": "₹85 L onwards",
        "tag": "Residential",
        "icon": "🏢",
    },
    {
        "id": 2,
        "name": "Nexus Business Hub",
        "type": "Commercial Tower",
        "location": "BKC, Mumbai",
        "duration": "24 months",
        "unit_label": "Office Suites",
        "units": "120 Units",
        "price": "₹1.8 Cr onwards",
        "tag": "Commercial",
        "icon": "🏙️",
    },
    {
        "id": 3,
        "name": "Greenfield Township",
        "type": "Integrated Township",
        "location": "Pune, MH",
        "duration": "36 months",
        "unit_label": "Total Units",
        "units": "600 Homes",
        "price": "₹65 L onwards",
        "tag": "Township",
        "icon": "🏘️",
    },
]

STATS = [
    {"label": "Projects Delivered", "value": "120+", "raw": "120+"},
    {"label": "Happy Families", "value": "8,500+", "raw": "8500+"},
    {"label": "Sq. Ft. Constructed", "value": "12M+", "raw": "12M+"},
    {"label": "Cities of Presence", "value": "18", "raw": "18"},
]


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "projects": PROJECTS,
            "stats": STATS,
        },
    )

