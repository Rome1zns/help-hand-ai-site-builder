

# Help Hand — Editor Page

## Overview
A 3-column editor interface for the "Help Hand" platform where users chat with AI to generate websites in real-time. The AI generates HTML/CSS/JS code that renders instantly in a sandboxed iframe. Interface fully in Russian.

## Architecture

```text
+--------------------+------------------------+------------------+
|   Left Panel       |    Center Panel        |   Right Panel    |
|                    |                        |                  |
|  Chat with AI      |  iframe Preview        |  File Tree       |
|  Prompt input      |  Desktop/Mobile toggle |  Component Tree  |
|  Message history   |  URL bar mock          |                  |
|  Streaming tokens  |                        |                  |
+--------------------+------------------------+------------------+
|            Toolbar: Publish | Export ZIP | Share              |
+--------------------------------------------------------------+
```

## New Route
- `/editor` route added to App.tsx
- Landing page "Начать бесплатно" button navigates to `/editor`

## Backend: Supabase Edge Function
- Enable Lovable Cloud + Lovable AI
- Create `supabase/functions/generate-site/index.ts`
- System prompt: "Ты — эксперт веб-разработчик. Генерируй полностью рабочий HTML/CSS/JS код на основе описания. Код должен работать без зависимостей. Отвечай только кодом в формате HTML."
- Streaming SSE responses using Lovable AI Gateway (google/gemini-3-flash-preview)
- Handle 429/402 errors with user-friendly messages

## Frontend Components

### `src/pages/Editor.tsx`
- Main layout with 3 resizable panels using `react-resizable-panels`
- Top toolbar bar with Publish, Export, Share buttons
- State management: messages array, generated code, file list

### `src/components/editor/ChatPanel.tsx`
- Message list with user/assistant bubbles
- Streaming text display (token-by-token)
- Input field at bottom with send button
- Auto-scroll to latest message

### `src/components/editor/PreviewPanel.tsx`
- Mock browser chrome (URL bar, dots)
- iframe with `srcdoc` for rendering generated HTML
- Desktop/Tablet/Mobile viewport toggle buttons
- Sandbox attribute for security

### `src/components/editor/FileTreePanel.tsx`
- Tree view showing generated files (index.html, style.css, script.js)
- Clickable items to view code sections
- Component tree extracted from generated HTML

### `src/components/editor/EditorToolbar.tsx`
- Top bar with project name
- "Опубликовать", "Экспортировать ZIP", "Поделиться" buttons
- Back to home link

### `src/lib/streamChat.ts`
- Reusable SSE streaming utility
- Parses AI response to extract HTML code blocks
- Token-by-token callback pattern

## AI Flow
1. User types prompt in chat panel
2. Message sent to `generate-site` edge function with full conversation history
3. Streaming response rendered token-by-token in chat
4. HTML code extracted from response and injected into iframe via `srcdoc`
5. File tree updates to reflect generated structure
6. User can continue chatting for iterative refinements — full history sent each time

## Code Extraction Logic
- Parse AI response for code between triple backticks or raw HTML
- If response contains `<!DOCTYPE html>` or `<html>`, treat entire response as code
- Extract and separate HTML/CSS/JS sections for file tree display

## Export ZIP
- Use JSZip (new dependency) to bundle generated files
- Download as `helphand-project.zip`

## Technical Details
- New dependency: `jszip` for ZIP export
- Uses existing `react-resizable-panels` for the 3-column layout
- Uses existing Framer Motion for panel animations
- Lovable AI Gateway with streaming SSE
- iframe sandboxed with `allow-scripts allow-same-origin`
- All UI text in Russian
- Responsive: on mobile, panels stack vertically with tab navigation

