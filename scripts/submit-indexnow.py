#!/usr/bin/env python3
"""Notify IndexNow partners (Bing, etc.) about URL updates on lipastudios.com."""
from __future__ import annotations

import json
import urllib.error
import urllib.request

HOST = "lipastudios.com"
KEY = "a1bf3fb2f48c78dff2a3ed0cfdf42fec"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

DEFAULT_URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/cursos.html",
    f"https://{HOST}/gym-cerebro.html",
    f"https://{HOST}/para-padres.html",
    f"https://{HOST}/curso.html",
    f"https://{HOST}/mi-rutina-cerebro.html",
    f"https://{HOST}/entrenador-cerebro.html",
    f"https://{HOST}/editorial.html",
    f"https://{HOST}/blog/refuerzo-escolar-7-minutos-brain-gym.html",
    f"https://{HOST}/blog.html",
    f"https://{HOST}/juegos-de-reflejos.html",
    f"https://{HOST}/guia-reflejos.html",
    f"https://{HOST}/moviles-gaming-baratos.html",
    f"https://{HOST}/test-reflejos.html",
    f"https://{HOST}/entrenador-reflejos.html",
    f"https://{HOST}/primaria/4-primaria",
    f"https://{HOST}/primaria/1-primaria",
    f"https://{HOST}/infantil/5-anos",
    f"https://{HOST}/eso/1-eso",
]

ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
]


def submit(urls: list[str]) -> None:
    payload = json.dumps(
        {
            "host": HOST,
            "key": KEY,
            "keyLocation": KEY_LOCATION,
            "urlList": urls,
        }
    ).encode("utf-8")
    headers = {"Content-Type": "application/json; charset=utf-8"}
    for endpoint in ENDPOINTS:
        req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"OK {endpoint} -> HTTP {resp.status}")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:200]
            print(f"HTTP {e.code} {endpoint}: {body}")
        except Exception as e:
            print(f"ERR {endpoint}: {e}")


if __name__ == "__main__":
    submit(DEFAULT_URLS)
