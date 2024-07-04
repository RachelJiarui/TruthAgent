export function fetchAuthor(aiAnalysis) {
  return aiAnalysis["author"];
}

export function fetchPublisher(aiAnalysis) {
  return aiAnalysis["publisher"];
}

export function fetchOtherSources(aiAnalysis) {
  return aiAnalysis["other_sources"];
}

export function fetchOtherSourcesSummary(aiAnalysis) {
  return aiAnalysis["other_sources_summary"];
}
