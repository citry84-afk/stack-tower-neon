#!/usr/bin/env python3
"""Comprueba que cada URL del sitemap responde 200 en producción."""
from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
TIMEOUT = 20


def fetch_status(url: str) -> int | str:
    req = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": "LIPA-sitemap-validator/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        if e.code in (405, 501):
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "LIPA-sitemap-validator/1.0"},
            )
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.status
        return e.code
    except Exception as e:
        return str(e)


def main() -> int:
    text = SITEMAP.read_text(encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", text)
    bad: list[tuple[str, int | str]] = []
    for url in locs:
        status = fetch_status(url)
        if status != 200:
            bad.append((url, status))
        print(f"{status}\t{url}")
    print(f"\nTotal: {len(locs)}  OK: {len(locs) - len(bad)}  FAIL: {len(bad)}")
    if bad:
        for url, status in bad:
            print(f"  FAIL {status}: {url}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
