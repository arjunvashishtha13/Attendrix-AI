const crypto = require('crypto');
const { faceConfidenceThreshold } = require('../config/env');

/**
 * Generates a deterministic pseudo-embedding from image buffer.
 * Replace this module with PyTorch/FaceNet integration for production ML.
 */
const extractEmbedding = (imageBuffer) => {
  const hash = crypto.createHash('sha256').update(imageBuffer).digest();
  const embedding = [];
  for (let i = 0; i < 128; i++) {
    embedding.push((hash[i % hash.length] / 255) * 2 - 1);
  }
  return embedding;
};

const euclideanDistance = (a, b) => {
  if (!a?.length || !b?.length || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

const distanceToConfidence = (distance) => {
  const confidence = Math.max(0, Math.min(1, 1 - distance / 2));
  return Math.round(confidence * 1000) / 1000;
};

const findBestMatch = (probeEmbedding, candidates) => {
  let best = null;
  let bestDistance = Infinity;

  candidates.forEach((candidate) => {
    if (!candidate.faceEmbedding?.length) return;
    const distance = euclideanDistance(probeEmbedding, candidate.faceEmbedding);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  });

  const confidence = best ? distanceToConfidence(bestDistance) : 0;
  const matched = confidence >= faceConfidenceThreshold;

  return {
    matched,
    confidence,
    threshold: faceConfidenceThreshold,
    student: matched ? best : null,
    distance: bestDistance === Infinity ? null : Math.round(bestDistance * 1000) / 1000,
    message: matched
      ? 'Face recognized successfully'
      : confidence > 0
        ? `Low confidence (${(confidence * 100).toFixed(1)}%). Minimum required: ${(faceConfidenceThreshold * 100).toFixed(0)}%`
        : 'No registered face embeddings found for this course',
  };
};

module.exports = {
  extractEmbedding,
  findBestMatch,
  faceConfidenceThreshold,
};
