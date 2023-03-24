import asyncio
import json

import websockets

from utils import get_anon_name, get_random_rgba

# to keep track of connected clients
clients = {}
colours = {}


# websocket represents the connection object established between client and server.
# path represents any path the client requested in the URI ("ws://localhost:8000/<path>") allowing for the implementation of routing.
async def handle_connection(websocket, path):

    name = await websocket.recv()
    if not name or name == 'null':
        name = get_anon_name()
    print(
        f"New connection from {name} at address: {websocket.remote_address}")

    # new connection. hash their name, get a random colour and attribute that colour to their name in the colours dictionary.
    # make it so

    user_colour = colours.setdefault(name, get_random_rgba())

    clients[websocket] = {
        'name': name,
        'user_colour': user_colour
    }
    try:
        async for message in websocket:
            # relay message to all connected clients
            for client in clients:
                payload = {
                    **clients[websocket],
                    'message': message
                }
                await client.send(json.dumps(payload))
    except websockets.exceptions.ConnectionClosedError:
        print(f"Connection closed from {websocket.remote_address}")
    finally:
        # remove client from set of connected clients
        clients.pop(websocket)


async def start_server():
    # starts the websocket server and binds it to the specified host and port. handle_connection will be used to handle incoming WebSocket connections.
    async with websockets.serve(handle_connection, "localhost", 8888):
        print("WebSocket server started on ws://localhost:8888")
        await asyncio.Future()  # wait forever

if __name__ == "__main__":
    asyncio.run(start_server())
