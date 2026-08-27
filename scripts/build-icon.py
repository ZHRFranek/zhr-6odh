from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parents[1]
png = root / "assets" / "zhr-liliyka-icon.png"
ico = root / "assets" / "zhr-liliyka.ico"

img = Image.open(png).convert("RGBA")
sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
img.save(ico, format="ICO", sizes=sizes)
print(f"Zapisano: {ico} ({ico.stat().st_size} b)")
