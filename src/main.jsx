import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/index.css';
import App from '@/App';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
