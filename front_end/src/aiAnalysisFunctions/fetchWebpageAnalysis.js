export function fetchWebpageAnalysis(aiAnalysis) {
  // console.log("Type of aiAnalysis:", typeof aiAnalysis);
  // console.log("Stored at aiAnalyis:", JSON.stringify(aiAnalysis));
  return aiAnalysis["webpage_annotations"];
}

export function fetchRedAnnotations(aiAnalysis) {
  // console.log(
  //   "What's in red:",
  //   JSON.stringify(fetchWebpageAnalysis(aiAnalysis)["red"]),
  // );
  return fetchWebpageAnalysis(aiAnalysis)["red"];
}

export function fetchOrangeAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["orange"];
}

export function fetchBlueAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["blue"];
}
