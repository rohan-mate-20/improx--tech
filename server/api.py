import sqlite3
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(title="Improx Tech Blog API")

# Allow your React Vite website (and production domains) to fetch articles
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://improxtech.com",
        "https://www.improxtech.com",
        "*",  # Allow all for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your SQLite blogs.db database
# Can be overridden via environment variable BLOGS_DB_PATH
DB_PATH = os.getenv("BLOGS_DB_PATH", "blogs.db")

def get_db():
    if not os.path.exists(DB_PATH):
        raise HTTPException(
            status_code=500,
            detail=f"Database file not found at '{DB_PATH}'. Please ensure 'blogs.db' exists or set BLOGS_DB_PATH.",
        )
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/health")
def health():
    return {"status": "ok", "db_connected": os.path.exists(DB_PATH)}

@app.get("/api/blogs")
def get_approved_blogs(category: Optional[str] = None, search: Optional[str] = None):
    """
    Returns all published/approved blogs for the listing page.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    query = """
        SELECT 
            b.id, 
            b.title, 
            b.status, 
            COALESCE(m.slug, CAST(b.id AS TEXT)) AS slug, 
            COALESCE(m.seo_title, b.title) AS seo_title, 
            m.meta_description, 
            COALESCE(m.category, 'Engineering') AS category, 
            m.featured_image, 
            b.created_at
        FROM blogs b
        LEFT JOIN blog_metadata m ON b.id = m.blog_id
        WHERE (b.status = 'approved' OR b.status = 'published' OR b.status = 'live')
    """
    params = []
    
    if category and category.lower() != 'all':
        query += " AND LOWER(m.category) = LOWER(?)"
        params.append(category)
        
    if search:
        query += " AND (b.title LIKE ? OR m.meta_description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
        
    query += " ORDER BY b.created_at DESC"
    
    cursor.execute(query, params)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/api/blogs/{slug_or_id}")
def get_blog_by_slug_or_id(slug_or_id: str):
    """
    Returns single blog post with full content (Markdown or HTML).
    Matches either by metadata slug or by blog ID.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            b.id, 
            b.title, 
            b.content, 
            b.status, 
            COALESCE(m.slug, CAST(b.id AS TEXT)) AS slug, 
            COALESCE(m.seo_title, b.title) AS seo_title, 
            m.meta_description, 
            COALESCE(m.category, 'Engineering') AS category, 
            m.tags, 
            m.featured_image, 
            b.created_at
        FROM blogs b
        LEFT JOIN blog_metadata m ON b.id = m.blog_id
        WHERE m.slug = ? OR CAST(b.id AS TEXT) = ?
    """, (slug_or_id, slug_or_id))
    
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Blog post not found")
        
    return dict(row)

if __name__ == "__main__":
    import uvicorn
    print("Starting Improx Blog API on http://localhost:8000 ...")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
