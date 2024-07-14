export function fetchWebpageAnalysis(aiAnalysis) {
  return aiAnalysis["webpage_annotations"];
}

export function fetchRedAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["red"];
}

export function fetchOrangeAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["orange"];
}

export function fetchBlueAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["blue"];
}
