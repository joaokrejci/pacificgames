import * as dgram from "node:dgram";

import { Server } from "../model/entities";
import ServerDAO from "../model/server_dao";

export default class NetworkDiscoverer {
    async start(host: string, port: number) {
        const server = dgram.createSocket("udp4");

        server.on('listening', () => {
            const address = server.address();
            console.log(`UDP Receiver listening on ${address.address}:${address.port}`);
        });

        server.on('message', (message, remote) => {
            if (message.toString().startsWith("PG:")) {
                const parts = message.toString().split(':');
                if (parts.length < 3) {
                    return;
                }

                console.info(`${parts[1]} server found on ${remote.address}:${parts[2]}`)

                ServerDAO.instance.touch(new Server(remote.address, Number.parseInt(parts[2]), parts[1], new Date()))
            }
        });

        server.on('error', (err) => {
            console.error(`Server error:\n${err.stack}`);
            server.close();
        });

        server.bind(port, host);
    }
}
