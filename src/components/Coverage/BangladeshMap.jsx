import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl } from "leaflet-geosearch";
import wearhouseData from "../../assets/data/warehouses.json";

// Fix Leaflet’s default marker icons not showing
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function SearchControl({ provider }) {
  const map = useMap();
  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);

  return null;
}

const BangladeshMap = ({ searchTerm = "" }) => {
  const filteredData = wearhouseData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.city.toLowerCase().includes(term) ||
      item.district.toLowerCase().includes(term) ||
      item.region.toLowerCase().includes(term)
    );
  });

  return (
    <div data-aos='fade-up' className="h-[400px] w-full rounded-md overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredData.map((item, index) => (
          <Marker key={index} position={[item.latitude, item.longitude]}>
            <Popup>
              <div className="space-y-1 text-sm">
                <h3 className="font-bold text-base text-primary">
                  {item.city}, {item.district}
                </h3>
                <p><strong>Region:</strong> {item.region}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Covered Areas:</strong></p>
                <ul className="list-disc ml-5 text-gray-700">
                  {item.covered_area.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
                {item.flowchart && (
                  <div className="mt-2">
                    <a
                      href={item.flowchart}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Flowchart
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
