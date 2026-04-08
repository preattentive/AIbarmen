import type { Cocktail } from '../types'

const BASE_URL = 'http://localhost:27123'

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'text/markdown',
  }
}

function cocktailToMarkdown(cocktail: Cocktail): string {
  const ingredientRows = cocktail.ingredients
    .map(({ name, measure }) => `| ${name} | ${measure || '—'} |`)
    .join('\n')

  const tags = cocktail.tags.length > 0 ? cocktail.tags.join(', ') : '—'

  return `---
tags:
  - cocktail
category: ${cocktail.category}
alcoholic: ${cocktail.isAlcoholic ? 'да' : 'нет'}
glass: ${cocktail.glass}
---

# ${cocktail.name}

![${cocktail.name}](${cocktail.image})

## Ингредиенты

| Ингредиент | Количество |
|------------|------------|
${ingredientRows}

## Приготовление

${cocktail.instructions}

## Теги

${tags}
`
}

export async function saveToObsidian(
  cocktail: Cocktail,
  apiKey: string,
  folder: string
): Promise<void> {
  const filename = cocktail.name.replace(/[/\\?%*:|"<>]/g, '-')
  const path = folder ? `${folder}/${filename}.md` : `${filename}.md`
  const url = `${BASE_URL}/vault/${encodeURIComponent(path)}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(apiKey),
    body: cocktailToMarkdown(cocktail),
  })

  if (!res.ok) {
    throw new Error(`Obsidian API error: ${res.status} ${res.statusText}`)
  }
}

export async function loadFromObsidian(
  apiKey: string,
  folder: string
): Promise<string[]> {
  const path = folder ? `${folder}/` : ''
  const url = `${BASE_URL}/vault/${encodeURIComponent(path)}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`Obsidian API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as { files: string[] }
  return data.files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '').split('/').pop() ?? f)
}

export async function deleteFromObsidian(
  name: string,
  apiKey: string,
  folder: string
): Promise<void> {
  const filename = name.replace(/[/\\?%*:|"<>]/g, '-')
  const path = folder ? `${folder}/${filename}.md` : `${filename}.md`
  const url = `${BASE_URL}/vault/${encodeURIComponent(path)}`

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok && res.status !== 404) {
    throw new Error(`Obsidian API error: ${res.status} ${res.statusText}`)
  }
}
