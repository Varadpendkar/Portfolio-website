import { projects } from "../src/data/projects.js";
import { skillCategories } from "../src/data/skills.js";
import { certifications, education } from "../src/data/certifications.js";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "which",
  "who",
  "with",
  "you",
  "your",
]);

const TOKEN_ALIASES = {
  mlops: ["deploy", "deployment", "docker", "cicd", "github", "actions"],
  nlp: ["llm", "transformers", "text", "prompt", "embedding"],
  cv: ["vision", "opencv", "object", "detection", "image"],
  portfolio: ["profile", "about", "projects", "skills", "resume"],
  ai: ["ml", "machine", "learning"],
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) => {
  const baseTokens = normalizeText(value)
    .split(" ")
    .filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));

  const expanded = [...baseTokens];
  baseTokens.forEach((token) => {
    if (TOKEN_ALIASES[token]) {
      expanded.push(...TOKEN_ALIASES[token]);
    }
  });

  return [...new Set(expanded)];
};

const splitIntoChunks = (text, chunkSize = 460, overlap = 80) => {
  const normalized = String(text || "").trim();
  if (!normalized) return [];

  const sentences = normalized.match(/[^.!?]+[.!?]?/g) || [normalized];
  const chunks = [];
  let current = "";

  sentences.forEach((sentence) => {
    const next = `${current} ${sentence}`.trim();

    if (next.length <= chunkSize) {
      current = next;
      return;
    }

    if (current) {
      chunks.push(current.trim());
      const tail = current.slice(Math.max(0, current.length - overlap));
      current = `${tail} ${sentence}`.trim();
      return;
    }

    chunks.push(sentence.trim());
    current = "";
  });

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
};

const createKnowledgeDocuments = () => {
  const docs = [
    {
      id: "profile-overview",
      title: "Varad Pendkar Profile Overview",
      domain: "profile",
      url: "/#about",
      content:
        "Varad Pendkar is an AI and Machine Learning engineer focused on NLP, Computer Vision, and production-oriented ML systems. He is a B.Tech AIML student at G. H. Raisoni College of Engineering, Pune, graduating in 2026.",
    },
    {
      id: "contact-overview",
      title: "Contact and Availability",
      domain: "contact",
      url: "/#contact",
      content:
        "Varad Pendkar is actively seeking AI/ML opportunities. Contact: varadpendkar@gmail.com. Location: Pune, Maharashtra, India.",
    },
  ];

  projects.forEach((project) => {
    docs.push({
      id: `project-${project.id}`,
      title: project.title,
      domain: "project",
      url: project.demo || project.github || "/#projects",
      content: [
        `${project.title}: ${project.shortDescription}.`,
        project.fullDescription,
        `Categories: ${project.categories.join(", ")}.`,
        `Tech stack: ${project.tech.join(", ")}.`,
        `Impact: ${project.keyMetric}.`,
        `Features: ${project.features.join("; ")}.`,
      ].join(" "),
    });
  });

  skillCategories.forEach((category) => {
    docs.push({
      id: `skill-${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: `${category.name} Skills`,
      domain: "skills",
      url: "/#skills",
      content: [
        `${category.name}: ${category.summary}.`,
        `Skills include ${category.skills
          .map((skill) => `${skill.name} (proficiency ${skill.level}/5)`)
          .join(", ")}.`,
      ].join(" "),
    });
  });

  docs.push({
    id: "education",
    title: "Education",
    domain: "education",
    url: "/#experience",
    content: [
      `${education.degree} at ${education.institution}.`,
      `Duration: ${education.duration}.`,
      `CGPA: ${education.cgpa}.`,
      `Relevant coursework: ${education.coursework.join(", ")}.`,
    ].join(" "),
  });

  certifications.forEach((certification) => {
    docs.push({
      id: `certification-${certification.id}`,
      title: `${certification.title} (${certification.issuer})`,
      domain: "certification",
      url: certification.credentialUrl,
      content: [
        `${certification.title} by ${certification.issuer} on ${certification.platform}.`,
        `Completed in ${certification.date}.`,
        `Topics: ${certification.topics.join(", ")}.`,
      ].join(" "),
    });
  });

  return docs;
};

const KNOWLEDGE_DOCS = createKnowledgeDocuments();

const KNOWLEDGE_CHUNKS = KNOWLEDGE_DOCS.flatMap((doc) => {
  const chunks = splitIntoChunks(doc.content);

  return chunks.map((chunk, index) => ({
    id: `${doc.id}::${index}`,
    sourceId: doc.id,
    title: doc.title,
    domain: doc.domain,
    url: doc.url,
    content: chunk,
    normalizedContent: normalizeText(chunk),
    normalizedTitle: normalizeText(doc.title),
    tokenSet: new Set(tokenize(`${doc.title} ${chunk}`)),
  }));
});

const scoreChunk = (chunk, query, tokens) => {
  const normalizedQuery = normalizeText(query);
  let score = 0;

  tokens.forEach((token) => {
    if (chunk.tokenSet.has(token)) {
      score += token.length >= 7 ? 2.4 : 1.4;
    }

    if (chunk.normalizedTitle.includes(token)) {
      score += 1.25;
    }
  });

  if (normalizedQuery && chunk.normalizedContent.includes(normalizedQuery)) {
    score += 7;
  }

  if (normalizedQuery && chunk.normalizedTitle.includes(normalizedQuery)) {
    score += 6;
  }

  const domainBoost = tokens.some((token) => chunk.domain.includes(token)) ? 1.2 : 0;
  score += domainBoost;

  return score;
};

const retrieveContext = (query, limit = 5) => {
  const tokens = tokenize(query);
  const scored = KNOWLEDGE_CHUNKS.map((chunk) => ({
    ...chunk,
    score: scoreChunk(chunk, query, tokens),
  }))
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score);

  const deduped = [];
  const seen = new Set();

  scored.forEach((chunk) => {
    if (deduped.length >= limit) return;
    const sourceKey = `${chunk.sourceId}:${chunk.domain}`;
    if (seen.has(sourceKey)) return;
    seen.add(sourceKey);
    deduped.push(chunk);
  });

  return deduped;
};

const buildFallbackAnswer = (question, citations) => {
  if (!citations.length) {
    return `I couldn't find enough portfolio context for: "${question}". Try asking about projects, skills, certifications, or contact details.`;
  }

  const highlights = citations.slice(0, 3).map((citation) => {
    const detail = citation.snippet.length > 170
      ? `${citation.snippet.slice(0, 170)}...`
      : citation.snippet;

    return `- ${detail} [${citation.label}]`;
  });

  return [
    `Here’s what I found in Varad's portfolio context for your question:`,
    ...highlights,
    "",
    "If you want, ask a follow-up like: 'show only NLP projects' or 'explain AI-MEDPAY architecture'.",
  ].join("\n");
};

const generateAnswerWithLLM = async ({ question, history, contextChunks, apiKey }) => {
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const sourceContext = contextChunks
    .map(
      (chunk, index) =>
        `[S${index + 1}] ${chunk.title} (${chunk.domain})\nURL: ${chunk.url || "N/A"}\n${chunk.content}`,
    )
    .join("\n\n");

  const recentHistory = history
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  const systemPrompt = `You are Varad AI Copilot for a portfolio website.
Rules:
1) Answer only from provided context.
2) If context is insufficient, clearly say what is missing.
3) Keep answers concise and recruiter-friendly.
4) Add source citations in square brackets like [S1], [S2].
5) Do not fabricate project metrics or links.`;

  const userPrompt = `Question: ${question}

Recent conversation:
${recentHistory || "(none)"}

Context sources:
${sourceContext}

Return a direct answer with short structure and include citation markers.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "I couldn't generate an answer right now.";
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = parseBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const question =
      (typeof body.question === "string" && body.question.trim()) ||
      (typeof lastUserMessage?.content === "string" && lastUserMessage.content.trim()) ||
      "";

    if (!question) {
      res.status(400).json({ error: "A question is required." });
      return;
    }

    const contextChunks = retrieveContext(question, 5);
    const citations = contextChunks.map((chunk, index) => ({
      label: `S${index + 1}`,
      title: chunk.title,
      domain: chunk.domain,
      url: chunk.url,
      snippet: chunk.content,
    }));

    const apiKey = process.env.OPENAI_API_KEY;
    let answer;

    if (apiKey) {
      answer = await generateAnswerWithLLM({
        question,
        history: messages,
        contextChunks,
        apiKey,
      });
    } else {
      answer = buildFallbackAnswer(question, citations);
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      answer,
      citations,
      meta: {
        mode: apiKey ? "llm-rag" : "fallback-rag",
        contextCount: citations.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate portfolio answer.",
      detail: error?.message || "Unknown server error",
    });
  }
}
