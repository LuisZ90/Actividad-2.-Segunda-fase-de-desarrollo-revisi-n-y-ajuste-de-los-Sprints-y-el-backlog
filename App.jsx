import React, { useState, useEffect } from 'react';
import './App.css';

// Datos simulados actualizados
const videos = [
  { id: 1, title: 'Álgebra Básica', subject: 'Matemáticas', url: 'https://youtu.be/basic-algebra', subtitles: true },
  { id: 2, title: 'Fotosíntesis', subject: 'Biología', url: 'https://youtu.be/photosynthesis', subtitles: false },
];

const pdfGuides = [
  { id: 1, title: 'Guía de Matemáticas (Mobile Optimized)', url: 'https://aws.s3/guia-matematicas-v2.pdf' },
  { id: 2, title: 'Guía de Biología (Mobile Optimized)', url: 'https://aws.s3/guia-biologia-v2.pdf' },
];

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProgress, setUserProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simular carga de recursos con Service Workers
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registrado para caché offline'))
        .catch(err => console.log('Error SW:', err));
    }
    setLoading(false);
  }, []);

  // Componente para visualización mejorada de PDFs
  const PdfViewer = ({ url }) => (
    <div className="pdf-viewer">
      <iframe
        title="PDF Viewer"
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );

  // Barra de progreso del usuario (ED016)
  const ProgressBar = ({ progress }) => (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        <span className="progress-text">{progress}% Completado</span>
      </div>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Plataforma Educativa v1.2</h1>
        <ProgressBar progress={userProgress} />
        <nav>
          <button>Videos</button>
          <button>Guías</button>
          <button>Mi Progreso</button>
        </nav>
      </header>

      <main>
        {/* Búsqueda mejorada (ED014b) */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar en videos y guías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          {loading && <div className="loading-indicator">Optimizando para 3G...</div>}
        </div>

        {/* Sección de Videos Mejorada */}
        <div className="video-section">
          <h2>Video Educativos {selectedVideo && `- ${selectedVideo.title}`}</h2>
          <div className="video-grid">
            {videos.map(video => (
              <div 
                key={video.id} 
                className={`video-card ${video.subtitles ? 'has-subtitles' : ''}`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="thumbnail-placeholder">
                  {video.subtitles && <span className="subtitle-badge">Subtítulos</span>}
                </div>
                <h3>{video.title}</h3>
                <p>{video.subject}</p>
              </div>
            ))}
          </div>

          {selectedVideo && (
            <div className="video-player-container">
              <iframe
                title={selectedVideo.title}
                width="100%"
                height="500"
                src={`${selectedVideo.url}?modestbranding=1&rel=0`}
                frameBorder="0"
                allowFullScreen
              >
                {selectedVideo.subtitles && 
                  <track
                    kind="subtitles"
                    srcLang="es"
                    label="Español"
                    default
                  />
                }
              </iframe>
            </div>
          )}
        </div>

        {/* Sección de PDFs Optimizados (ED015) */}
        <div className="pdf-section">
          <h2>Guías Educativas {selectedPdf && `- ${selectedPdf.title}`}</h2>
          <div className="mobile-warning">📱 Versión mobile optimizada</div>
          <div className="pdf-grid">
            {pdfGuides.map(pdf => (
              <div
                key={pdf.id}
                className="pdf-card"
                onClick={() => setSelectedPdf(pdf)}
              >
                <div className="pdf-icon"></div>
                <h3>{pdf.title}</h3>
                <a
                  href={pdf.url}
                  download
                  className="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserProgress(prev => Math.min(prev + 5, 100));
                  }}
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
          
          {selectedPdf && <PdfViewer url={selectedPdf.url} />}
        </div>
      </main>
    </div>
  );
}

export default App;
