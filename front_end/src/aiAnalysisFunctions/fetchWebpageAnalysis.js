// EXAMPLE OF AI ANALYSIS STRUCTURE
/*
{
    "author":"...",
    "date":"...",
    "other_sources":{
        "url":"...",
        ...
    },
    "other_sources_summary":"...",
    "publisher":"...",
    "webpage_annotations":{
        "Blue":[

        ],
        "Orange":[

        ],
        "Red":[

        ]
    }
}
*/

export function fetchWebpageAnalysis(aiAnalysis) {
  console.log("Type of aiAnalysis:", typeof aiAnalysis);
  console.log("Stored at aiAnalyis:", JSON.stringify(aiAnalysis));
  return aiAnalysis["webpage_annotations"];
}

export function fetchRedAnnotations(aiAnalysis) {
  console.log(
    "Type of webpage annotations:",
    JSON.stringify(fetchWebpageAnalysis(aiAnalysis)),
  );
  return fetchWebpageAnalysis(aiAnalysis)["Red"];
}

export function fetchOrangeAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["Orange"];
}

export function fetchBlueAnnotations(aiAnalysis) {
  return fetchWebpageAnalysis(aiAnalysis)["Blue"];
}
