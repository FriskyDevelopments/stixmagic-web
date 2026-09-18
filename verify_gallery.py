from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000/gallery")
    page.wait_for_timeout(1000)

    # Hover over the gallery cards to show focus-visible and download links
    cards = page.locator('.group.rounded-\\[1\\.75rem\\]')

    # Check if there are cards
    if cards.count() > 0:
        # Hover first card
        cards.nth(0).hover()
        page.wait_for_timeout(1000)

        # Focus on the first download link
        page.keyboard.press("Tab")
        page.wait_for_timeout(1000)

        # Focus on the second download link
        page.keyboard.press("Tab")
        page.wait_for_timeout(1000)

    page.screenshot(path="verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
