function WelcomeContextPage({ aiAnalysis }) {
  // This welcome page will also serve as the context page
  return (
    <div>
      <h1>Analysis done on {aiAnalysis.title}</h1>
      <p>{aiAnalysis.author}</p>
      <p>{aiAnalysis.publisher}</p>
      <p>
        {Object.entries(aiAnalysis.other_sources).map(
          ([url, summary], index) => (
            <span key={index}>{url}</span>
          ),
        )}
      </p>
      <p>{aiAnalysis.other_sources_summary}</p>
    </div>
  );
}

export default WelcomeContextPage;
