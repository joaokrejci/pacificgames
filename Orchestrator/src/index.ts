import NetworkDiscoverer from "./server/network_discoverer"
import { start as startHttpServer } from "./server/http_server"

const discoverer = new NetworkDiscoverer()
discoverer.start('0.0.0.0', 17000);

startHttpServer();
