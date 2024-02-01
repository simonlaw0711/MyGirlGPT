import asyncio
import websockets
import json

class WebsocketServer:
    def __init__(self, port):
        self.port = port
        self.start_server = websockets.serve(self.handle_connection, 'localhost', port)
        self.clients = set()

    async def handle_connection(self, websocket, path):
        self.clients.add(websocket)
        try:
            print(f'handleConnect: {websocket.remote_address}')
            async for message in websocket:
                data = json.loads(message)
                if 'message_response' in data:
                    await self.on_message_response(data['message_response'])
        except websockets.ConnectionClosed:
            print(f'socket disconnect: {websocket.remote_address}')
        finally:
            self.clients.remove(websocket)

    async def send_message_request(self, data):
        if self.clients:  # 發送消息給所有連接的客戶端
            message = json.dumps({'message_request': data})
            await asyncio.wait([client.send(message) for client in self.clients])

    async def on_message_response(self, data):
        # 在這裡處理 message_response
        print(f'Message Response: {data}')

    def start(self):
        asyncio.get_event_loop().run_until_complete(self.start_server)
        asyncio.get_event_loop().run_forever()

    def stop(self):
        # 處理停止服務器的邏輯
        pass

if __name__ == '__main__':
    websocket_server = WebsocketServer(8000)
    websocket_server.start()
