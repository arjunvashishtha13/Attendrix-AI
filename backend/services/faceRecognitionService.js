const { faceConfidenceThreshold } = require('../config/env');

const euclideanDistance = (a, b) => {
  if (!a?.length || !b?.length || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

// With face-api.js euclidean distance, 0.4 is usually a good threshold for strict match.
// 0.6 is loose. Our distanceToConfidence maps distance 0 -> 1.0 confidence, distance 0.4 -> 0.8 confidence.
const distanceToConfidence = (distance) => {
  const confidence = Math.max(0, Math.min(1, 1 - distance / 2));
  return Math.round(confidence * 1000) / 1000;
};

const findBestMatch = (probeEmbedding, candidates) => {
  let best = null;
  let bestDistance = Infinity;

  candidates.forEach((candidate) => {
    if (!candidate.faceEmbeddings || candidate.faceEmbeddings.length === 0) return;
    
    // Compare live probe against ALL registered embeddings for this candidate
    candidate.faceEmbeddings.forEach(enrolledEmbedding => {
      const distance = euclideanDistance(probeEmbedding, enrolledEmbedding);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
  });

  const confidence = best ? distanceToConfidence(bestDistance) : 0;
  const matched = confidence >= faceConfidenceThreshold; // Using env threshold

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
  euclideanDistance,
  findBestMatch,
  faceConfidenceThreshold,
};
