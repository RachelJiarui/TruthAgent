function WelcomeContextPage({ aiAnalysis }) {
  // This welcome page will also serve as the context page
  return (
    <div>
      <div className="context-title">{aiAnalysis.title}</div>
      <div className="context-author">by {aiAnalysis.author}</div>
      <div className="context-publisher">at {aiAnalysis.publisher}</div>
      <div className="context-date">published {aiAnalysis.date_analysis}</div>
      <div className="context-subtitle">Other Sources</div>
      {Object.entries(aiAnalysis.other_sources).map(
        ([url, titleAndContent], index) => (
          <div className="context-sources" key={index}>
            <a
              className="context-sources-url"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
            >
              {titleAndContent[0]}
            </a>
          </div>
        ),
      )}
      <div className="context-subtitle">Summary of Other Sources</div>
      <div>{aiAnalysis.other_sources_summary}</div>
    </div>
  );
}

export default WelcomeContextPage;
