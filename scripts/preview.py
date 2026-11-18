"""Local-only preview: python scripts/preview.py. Stop with Ctrl+C."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import argparse

parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8743)
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent/'dist'
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.mjs':'text/javascript','.js':'text/javascript'}
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=str(root)))
print(f'Local preview: http://127.0.0.1:{args.port}/zacnite-tu/',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
