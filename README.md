# SVG Composer

An AI-powered web application that generates editable SVG infographics using Google's Gemini API.

## Features

- **AI-Powered Generation**: Uses Gemini's image generation API to create professional infographics
- **Element Analysis**: Automatically identifies and isolates individual elements from the generated infographic
- **SVG Output**: Assembles elements into a fully editable SVG file with layered structure
- **Multiple Export Formats**:
  - SVG file (editable vector format)
  - PNG preview (high-quality raster image)
  - ZIP bundle (SVG + individual element PNGs with transparent backgrounds)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **JSZip** - ZIP file generation
- **Gemini API** - AI image generation and analysis

## Prerequisites

- Node.js 18+ and npm
- A valid [Google Gemini API key](https://makersuite.google.com/app/apikey)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Infographicsvg
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### 1. API Key Setup

On first launch, you'll be prompted to enter your Gemini API key. The key is:
- Stored locally in your browser's localStorage
- Never sent to any server except Google's Gemini API
- Used for authentication with Gemini services

### 2. Create an Infographic

1. Enter a detailed description of the infographic you want to create
2. (Optional) Customize dimensions in Advanced Options
3. Click "Generate Infographic"

Example prompt:
```
Create a modern infographic about the benefits of renewable energy,
including solar, wind, and hydro power. Use icons, charts, and statistics.
Make it colorful and professional.
```

### 3. Processing Pipeline

The app follows a 4-step pipeline:

1. **Generate Infographic** - Creates the complete infographic based on your prompt
2. **Analyze Elements** - Uses AI to identify individual visual elements and their positions
3. **Regenerate Elements** - Recreates each element separately with transparent backgrounds
4. **Assemble SVG** - Combines all elements into a single, layered SVG file

### 4. Download Your Work

After generation, you can download:
- **SVG File**: Editable in vector graphics software (Adobe Illustrator, Inkscape, etc.)
- **PNG Preview**: High-quality raster image for immediate use
- **ZIP Bundle**: Complete package with SVG + individual element PNGs

## Project Structure

```
svg-composer/
├── src/
│   ├── components/          # React UI components
│   │   ├── ApiKeyInput.jsx      # API key validation screen
│   │   ├── PromptInput.jsx      # Infographic prompt input
│   │   ├── ProcessingStatus.jsx # Progress indicator
│   │   └── PreviewDownload.jsx  # Preview and download screen
│   ├── services/            # Core business logic
│   │   ├── geminiApi.js         # Gemini API integration
│   │   ├── imageAnalyzer.js     # Element detection and analysis
│   │   ├── svgAssembler.js      # SVG file construction
│   │   └── fileExporter.js      # Download functionality
│   ├── utils/              # Utility functions
│   │   ├── base64.js           # Base64 conversion helpers
│   │   └── localStorage.js     # API key storage
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Configuration

The application uses two Gemini models:

- **gemini-3-pro-image-preview**: For image generation (infographic + individual elements)
- **gemini-3-pro-preview**: For analyzing the infographic and identifying elements

### API Endpoints

- Base URL: `https://generativelanguage.googleapis.com/v1beta/models/`
- Authentication: API key passed as query parameter

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Error Handling

The application includes comprehensive error handling:

- **API Key Validation**: Verifies key before allowing generation
- **Network Errors**: Automatic retry (up to 2 times) for failed API calls
- **Generation Failures**: Clear error messages with option to retry
- **Graceful Degradation**: Continues if some elements fail to regenerate

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires modern browser features:
- ES6+ JavaScript
- Fetch API
- FileReader API
- Canvas API

## Limitations

- Image generation depends on Gemini API availability and quota
- Processing time varies based on infographic complexity (typically 2-5 minutes)
- Element detection accuracy depends on the clarity and structure of the generated infographic
- Large dimension requests may be adjusted by the API

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
