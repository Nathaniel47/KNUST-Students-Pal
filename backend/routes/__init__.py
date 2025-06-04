from .login          import router as login_router
from .announcements  import router as announcements_router
from .chatbot        import router as chatbot_router
from .scheduler      import router as scheduler_router
from .scraper        import router as scraper_router
from .register          import router as users_router

# Export a single list so main.py can stay tiny
all_routers = [
    login_router,
    announcements_router,
    chatbot_router,
    scheduler_router,
    scraper_router,
    users_router,
]