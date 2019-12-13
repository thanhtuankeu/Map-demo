import React, { useRef } from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { Marker } from 'react-leaflet';

import { promiseToFlyTo, getCurrentLocation } from 'lib/map';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

import gatsby_astronaut from 'assets/images/gatsby-astronaut.jpg';

const LOCATION = {
  lat: 21.030924,
  lng: 105.782723
};
const LOCATION_EMXINHATMOTBAI = {
  lat: 18.667574,
  lng: 105.688045
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const CENTER2 = [ LOCATION_EMXINHATMOTBAI.lat,  LOCATION_EMXINHATMOTBAI.lng];
const DEFAULT_ZOOM = 2;
const ZOOM = 10;

const timeToZoom = 2000;
const timeToOpenPopupAfterZoom = 4000;
const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

const popupContentHello = `<p>Hello 👋</p>`;
const popupContentGatsby = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-image">
      <img class="gatsby-astronaut" src=${gatsby_astronaut} />
    </div>
    <div class="popup-gatsby-content">
      <h1>Gatsby Leaflet Starter</h1>
      <p>Welcome to your new Gatsby site. Now go build something great!</p>
    </div>
  </div>
`;

const IndexPage = () => {
  const markerRef = useRef();

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    if (!leafletElement) return;
    /*

      console.log('run here')
      try {
        let santa = await fetch('http://localhost:8080/student/show/');
        let santaJson = await santa.json();
        console.log('run there ', santaJson)
      } catch (e) {
        throw new Error(`Failed to find Santa!: ${e}`)
      }
    */
    const popup = L.popup({
      maxWidth: 800
    });

    const location = await getCurrentLocation().catch(() => LOCATION);

    const { current = {} } = markerRef || {};
    const { leafletElement: marker } = current;

    marker.setLatLng(location);
    popup.setLatLng(location);
    popup.setContent(popupContentHello);

    setTimeout(async () => {
      await promiseToFlyTo(leafletElement, {
        zoom: ZOOM,
        center: location
      });

      marker.bindPopup(popup);

      setTimeout(() => marker.openPopup(), timeToOpenPopupAfterZoom);
      setTimeout(() => marker.setPopupContent(popupContentGatsby), timeToUpdatePopupAfterZoom);
    }, timeToZoom);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
        <Marker ref={markerRef} position={CENTER} />
        <Marker ref={markerRef} position={CENTER2} />
      </Map>

      <Container type="content" className="text-center home-start">
        <h2>Test change</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
