import random
import asyncio
import websockets

# to keep track of connected clients
clients = {}


async def handle_connection(websocket, path):
    name = await websocket.recv()
    if not name or name == 'null':
        name = 'AnonUser' + str(random.randint(10000, 99999))
    print(
        f"New connection from {name} at address: {websocket.remote_address}")
    clients[websocket] = {'name': name}
    try:
        async for message in websocket:
            # relay message to all connected clients
            for client in clients:
                await client.send(f"{clients[websocket].get('name', '<user>')}:{message}")
    except websockets.exceptions.ConnectionClosedError:
        print(f"Connection closed from {websocket.remote_address}")
    finally:
        # remove client from set of connected clients
        clients.pop(websocket)


async def start_server():
    async with websockets.serve(handle_connection, "localhost", 8888):
        print("WebSocket server started on ws://localhost:8888")
        await asyncio.Future()  # wait forever

if __name__ == "__main__":
    asyncio.run(start_server())
