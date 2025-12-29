# IndoCourse: Survival Indonesian

A premium, open-source Indonesian language course for travelers and expats.

## Project Structure

*   `ebook/`: Markdown source files for the chapters.
*   `assets/`: Images and Styles (CSS/SVG).
*   `scripts/`: Build scripts for PDF and Audio.
*   `index.html`: Marketing landing page.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Build the PDF eBook:**
    ```bash
    npm run build:pdf
    ```
    Output: `IndoCourse_Survival_Indonesian.pdf`

3.  **Extract Audio Scripts:**
    ```bash
    npm run build:audio
    ```
    Output: `audio_production_script.txt` (and `.json`)

4.  **View the Website:**
    Open `index.html` in your browser.

## Design System
*   **Font:** Nunito (Sans) & Lora (Serif).
*   **Colors:** Terracotta (`#E07A5F`), Sage (`#81B29A`), Cream (`#FDFBF7`), Charcoal (`#3D405B`).
