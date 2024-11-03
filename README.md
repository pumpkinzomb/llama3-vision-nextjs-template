# Llama3.2 multi-modal image-reading template

A Next.js application that leverages Meta's Llama 3.2 Vision-Instruct multimodal model (meta-llama/Llama-3.2-11B-Vision-Instruct) to provide detailed, natural language descriptions of uploaded images.

## Features

- 🖼️ Drag-and-drop or click-to-upload image interface
- 🤖 Powered by Meta's Llama 3.2 Vision-Instruct model (11B parameters)
- 💫 Real-time streaming responses
- 📝 Comprehensive image analysis covering:
  - Primary subjects and their attributes
  - Environmental details
  - Spatial relationships
  - Lighting and color analysis
  - Atmospheric elements
  - Textural qualities
  - Compositional elements

## Tech Stack

- Next.js 14
- React
- TypeScript
- Hugging Face Inference API
- react-dropzone
- Tailwind CSS

## Model Information

This project uses the `meta-llama/Llama-3.2-11B-Vision-Instruct` model from Hugging Face, which is a multimodal variant of Llama 3.2 capable of:
- Processing both text and images simultaneously
- Understanding visual content and context
- Generating detailed natural language descriptions
- Providing rich, context-aware analysis of visual elements

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- A Hugging Face API key
- npm or yarn installed

## Environment Setup

Create a `.env` file in the root directory:

```
HUGGINGFACE_API_KEY=your_api_key_here
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload an image by dragging and dropping or clicking the upload area
3. Wait for the AI to analyze your image
4. View the detailed description in the text area on the right

## API Endpoints

### POST /api/generate/stream

Processes images and returns AI-generated descriptions.

**Request:**
- Method: POST
- Body: FormData
  - `image`: Image file (supported formats: PNG, JPG, JPEG, GIF)
  - `prompt`: Custom prompt for analysis (optional)

**Response:**
- Streams the AI-generated description as text/plain

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Meta for the Llama 3.2 Vision-Instruct multimodal model
- Hugging Face for hosting the model and providing the inference API
- Next.js team for the amazing framework