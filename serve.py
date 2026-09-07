#!/usr/bin/env python3
"""Serve the site with the same clean URLs as production.

/services serves services.html, / serves index.html, and /services/ works
too. Unknown paths get 404.html with a real 404 status. In production the
Replit static deployment does the same through the rewrite rules at the end
of .replit, which the page build regenerates.

Usage: python3 serve.py [port] [bind address]
"""
import http.server
import io
import os
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
BIND = sys.argv[2] if len(sys.argv) > 2 else "0.0.0.0"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def resolve(self):
        p = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        p = p.rstrip("/") or "/"
        if p == "/":
            return os.path.join(ROOT, "index.html")
        full = os.path.normpath(os.path.join(ROOT, p.lstrip("/")))
        if not full.startswith(ROOT + os.sep):
            return None
        if os.path.isfile(full):
            return full
        if os.path.isfile(full + ".html"):
            return full + ".html"
        return None

    def send_head(self):
        target = self.resolve()
        if target is None:
            with open(os.path.join(ROOT, "404.html"), "rb") as f:
                body = f.read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            return io.BytesIO(body)
        self.path = "/" + os.path.relpath(target, ROOT).replace(os.sep, "/")
        return super().send_head()

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    print(f"Serving {ROOT} at http://{BIND}:{PORT}/")
    http.server.ThreadingHTTPServer((BIND, PORT), Handler).serve_forever()
