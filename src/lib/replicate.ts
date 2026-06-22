const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_KEY

export async function classifyGarment(imageBase64: string): Promise<string[]> {
  if (!REPLICATE_API_TOKEN) {
    return generatePlaceholderTags()
  }

  try {
    // Extract base64 data
    const base64Data = imageBase64.split(',')[1] || imageBase64

    // Use a vision model to analyze the image
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: 'llava-13b', // Vision model
        input: {
          image: `data:image/jpeg;base64,${base64Data}`,
          prompt: 'Describe this clothing item in 3 words: 1) type (e.g., shirt, pants, dress), 2) category (e.g., casual, formal, sportwear), 3) main color. Format: type|category|color',
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Poll for result
    let result = data
    while (result.status === 'processing') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
        },
      })
      result = await checkResponse.json()
    }

    if (result.status === 'succeeded' && result.output) {
      const text = Array.isArray(result.output) ? result.output.join('') : result.output
      const tags = text.split('|').map((t: string) => t.trim())
      return tags.length >= 3 ? tags.slice(0, 3) : [...tags, ...generatePlaceholderTags().slice(tags.length)]
    }

    return generatePlaceholderTags()
  } catch (err) {
    console.error('Replicate API error:', err)
    return generatePlaceholderTags()
  }
}

function generatePlaceholderTags(): string[] {
  const types = ['Prenda', 'Vestido', 'Camisa', 'Pantalón']
  const categories = ['Casual', 'Formal', 'Deportivo', 'Elegante']
  const colors = ['Negro', 'Blanco', 'Azul', 'Gris']

  return [
    types[Math.floor(Math.random() * types.length)],
    categories[Math.floor(Math.random() * categories.length)],
    colors[Math.floor(Math.random() * colors.length)],
  ]
}
