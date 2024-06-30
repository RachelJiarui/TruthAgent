export function fetchWebpageAnalysis(aiAnalysis) {
  return aiAnalysis["webpage_annotations"];
}

export function fetchRedAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["Red"];
}

export function fetchOrangeAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["Orange"];
}

export function fetchBlueAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["Blue"];
}
