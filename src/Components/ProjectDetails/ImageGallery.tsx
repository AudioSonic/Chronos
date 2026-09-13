const images = ['Chronos-hero.png', 'dashboard-mockup.jpg', 'skill-tree.png', 'mobile-view.jpg', 'farbkonzept.png', 'typografie.png']

export default function ImageGallery() {
  return <section className="resource-card"><div className="resource-heading"><div><h2>▧ &nbsp; Bildergalerie</h2><p>Alle Bilder (JPG, PNG) aus deinem Projekt.</p></div><button className="resource-action" type="button">＋ Bilder hinzufügen</button></div><div className="image-grid">{images.map((image, index) => <div className={`image-placeholder image-${index + 1}`} key={image}><span>✦</span><strong>{image}</strong><small>{String(index + 1).padStart(2, '0')}.09.2026</small></div>)}</div></section>
}
