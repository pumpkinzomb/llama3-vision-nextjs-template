import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const prompt =
      (formData.get("prompt") as string) ||
      "Describe this image in one sentence.";

    if (!imageFile) {
      throw new Error("No image provided");
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const stream = await hf.chatCompletionStream({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/${imageFile.type};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `You are an AI vision system with exceptional attention to detail. Analyze this image 
   and create a comprehensive, detailed description that captures every significant visual element.
   
   Thoroughly observe and integrate:
   - Primary subject: identity, pose, expression, clothing, distinctive features
   - Environmental details: setting, furniture, decorative elements, plants, textures
   - Spatial dynamics: depth, perspective, positioning, scale relationships
   - Light characteristics: direction, intensity, shadows, reflections, time of day
   - Color nuances: primary palette, subtle tones, color interactions, gradients
   - Atmospheric elements: mood, energy, emotional quality, environmental feeling
   - Textural qualities: surface details, material properties, patterns
   - Compositional subtleties: balance, focus points, visual flow, framing
   
   Combine these observations into 2-3 flowing, connected sentences. Maintain natural 
   language while being specific and detailed. Focus on visual elements that build a 
   complete scene. Move from main elements to subtle details, creating a rich but 
   coherent description.
   
   Provide only the detailed description - no style instructions or technical terms.`,
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    // Convert the stream to a Web API ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.choices && chunk.choices.length > 0) {
              const content = chunk.choices[0].delta.content;
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return a standard Response object with the stream
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Error details:", error);
    return Response.json(
      { error: error.message || "Failed to process the request" },
      { status: 500 }
    );
  }
}
