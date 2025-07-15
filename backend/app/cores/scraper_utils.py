# app/cores/scraper_utils.py

import logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from fastapi import HTTPException
from app.database import SessionLocal
from app.crud import save_update_if_new

BASE_URL = "https://www.knust.edu.gh"

# Converts all relative image paths in the HTML to absolute URLs.
def make_image_urls_absolute(html_content: str, base_url: str) -> str:
    soup = BeautifulSoup(html_content, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src.startswith("/"):
            img["src"] = urljoin(base_url, src)
    return str(soup)

def scrape_section(url_path: str):
    full_url = BASE_URL + url_path
    try:
        response = requests.get(full_url)
        response.raise_for_status()
        logging.info(f"✅ Successfully fetched section page: {full_url}")
    except requests.RequestException as e:
        logging.error(f"❌ Failed to fetch section page: {full_url} | Reason: {e}")
        return []
    soup = BeautifulSoup(response.content, "html.parser")

    # Hardcode tag based on the URL path
    if url_path == "/news":
        tag = "news"
        articles = soup.select("a.row")

    elif url_path == "/announcements":
        tag = "announcements"
        articles = soup.select("div.col-sm-12")  # Specific to announcements

    elif url_path == "/events":
        tag = "events"
        articles = soup.select("a.row")  # Assuming it uses the same layout as news

    else:
        tag = "unknown"
        articles = []
    data = []

    for article in articles:
        if tag == "announcements":
            title_tag = article.select_one("div.col-sm-9 > h3")
            date_tag = article.select_one("div.col-sm-9 > span")
            link_tag = article.select_one("div.col-sm-2 > a")
            link = urljoin(BASE_URL, link_tag['href'].strip()) if link_tag else ""
            summary_tag = None
            image_tag = None
            category_tag = None
        else:
            title_tag = article.select_one("h3")
            summary_tag = article.select_one("p")
            image_tag = article.select_one("img")
            date_tag = article.select_one(".post-date")
            category_tag = article.select_one(".post-cat")
            link = urljoin(BASE_URL, article["href"].strip()) if article.has_attr("href") else ""
            


        
        # Fetch full content
        content = ""
        try:
            article_response = requests.get(link)
            article_response.raise_for_status()
            article_soup = BeautifulSoup(article_response.content, "html.parser")

            if tag == "announcements":
                content_div = article_soup.select_one("div.ann-info")
            else:
                content_div = article_soup.select_one(".article-content")

            content = str(content_div) if content_div else ""
            content = make_image_urls_absolute(content, BASE_URL)
        except Exception as e:
            logging.warning(f"⚠️ Failed to fetch full content from {link}: {e}")


        
        data.append({
            "title": title_tag.text.strip() if title_tag else "",
            "summary": summary_tag.text.strip() if summary_tag else "",
            "image": BASE_URL + image_tag['src'] if image_tag else "",
            "date": date_tag.text.replace("Published:", "").strip() if date_tag else "",
            "category": category_tag.text.strip() if category_tag else "",
            "link": link,
            "tag": tag,
            "content": content
        })

    logging.info(f"📦 Extracted {len(data)} articles from {url_path}")
    return data

   # Save scraped updates to database
def sync_updates():
    db = SessionLocal()
    try:
        paths = ["/news", "/announcements", "/events"]
        added = []

        for path in paths:
            updates = scrape_section(path)
            for update in updates:
                saved = save_update_if_new(db, update)
                if saved:
                    added.append(saved.title)

        return {"message": f"{len(added)} new updates saved.", "titles": added}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
