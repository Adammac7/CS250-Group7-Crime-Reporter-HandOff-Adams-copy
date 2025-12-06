import React from 'react';
import './Styles/ArcGIS.css';

/**
 * ArcGISMap
 * Props:
 * - embedUrl (string) : full iframe src URL to use (preferred)
 * - webmapId (string) : ArcGIS webmap id; used to build an embed URL if embedUrl not provided
 * - extent (string) : extent coordinates to append (e.g. "-117.0854,32.7663,-117.0601,32.7792")
 * - title (string) : iframe title
 * - disableScroll (bool) : append disable_scroll=true when building URL
 *
 * Example:
 * <ArcGISMap webmapId="f12d28c2b87d49359efc339231870009" extent="-117.0854,32.7663,-117.0601,32.7792" />
 */
const ArcGISMap = ({ embedUrl, webmapId, extent, title = 'ArcGIS Map', disableScroll = true }) => {
  let src = embedUrl;

  if (!src && webmapId) {
    const extentParam = extent ? `&extent=${encodeURIComponent(extent)}` : '';
    const disableScrollParam = disableScroll ? '&disable_scroll=true' : '';
    src = `https://www.arcgis.com/apps/Embed/index.html?webmap=${encodeURIComponent(webmapId)}${extentParam}&zoom=true&previewImage=false&scale=true${disableScrollParam}&theme=light`;
  }

  if (!src) {
    // Nothing to render
    return <div className="arcgis-embed-error">No embedUrl or webmapId provided for ArcGISMap.</div>;
  }

  return (
    <div className="embed-container" aria-label={title}>
      <iframe
        title={title}
        src={src}
        width="500"
        height="400"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        allowFullScreen
      />
    </div>
  );
};

export default ArcGISMap;
